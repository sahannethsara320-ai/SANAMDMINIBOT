// ═══════════════════════════════════════════════════════════════════════════
//  SANA MD MINI BOT - CHANNEL FORWARDING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const moment = require('moment-timezone');
const config = require('../config');

// ═══════════════════════════════════════════════════════════════════════
//  🔗 YOUR CHANNEL INFO (ඔබගේ Channel තොරතුරු)
// ═══════════════════════════════════════════════════════════════════════

const CHANNEL_INFO = {
    LID: '95276031316176@lid',  // ← ඔබගේ Channel LID
    LINK: 'https://whatsapp.com/channel/0029Vb7x5E817En3hMhKxf36',  // ← ඔබගේ Channel Link
    NAME: 'Your Channel Name',
    LOGO: 'https://i.postimg.cc/dtfrgJRn/download-(6).jpg'
};

// ═══════════════════════════════════════════════════════════════════════
//  🔄 STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

const botState = {
    startTime: Date.now(),
    messageCount: 0,
    forwardedCount: 0,
    isConnected: false,
    connectedUsers: new Set(), // Connect වුණු users ලැයිස්තුව
    bioInterval: null
};

// ═══════════════════════════════════════════════════════════════════════
//  📝 LOGGER
// ═══════════════════════════════════════════════════════════════════════

const logger = {
    info: (msg) => console.log(`[${getTime()}] ℹ️ ${msg}`),
    success: (msg) => console.log(`[${getTime()}] ✅ ${msg}`),
    error: (msg) => console.log(`[${getTime()}] ❌ ${msg}`),
    warning: (msg) => console.log(`[${getTime()}] ⚠️ ${msg}`)
};

function getTime() {
    return moment().format('HH:mm:ss');
}

// ═══════════════════════════════════════════════════════════════════════
//  🔧 UTILITIES
// ═══════════════════════════════════════════════════════════════════════

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

// ═══════════════════════════════════════════════════════════════════════
//  📨 CHANNEL FORWARDING SYSTEM
// ═══════════════════════════════════════════════════════════════════════

/**
 * Forward channel message to connected user
 * Channel message එක connect වුණු userට forward කරයි
 */
async function forwardChannelMessage(conn, message, userJid) {
    try {
        const msgType = Object.keys(message.message || {})[0];
        const content = message.message;
        
        // Text message
        if (msgType === 'conversation' || msgType === 'extendedTextMessage') {
            const text = content.conversation || content.extendedTextMessage?.text;
            await conn.sendMessage(userJid, {
                text: `📢 *Channel Update*\n\n${text}\n\n🔗 ${CHANNEL_INFO.LINK}`,
                contextInfo: {
                    externalAdReply: {
                        title: CHANNEL_INFO.NAME,
                        body: 'Click to join channel',
                        thumbnailUrl: CHANNEL_INFO.LOGO,
                        sourceUrl: CHANNEL_INFO.LINK
                    }
                }
            });
        }
        
        // Image message
        else if (msgType === 'imageMessage') {
            const buffer = await downloadMedia(conn, message, 'image');
            const caption = content.imageMessage?.caption || '';
            await conn.sendMessage(userJid, {
                image: buffer,
                caption: `📸 *Channel Image*\n\n${caption}\n\n🔗 ${CHANNEL_INFO.LINK}`
            });
        }
        
        // Video message
        else if (msgType === 'videoMessage') {
            const buffer = await downloadMedia(conn, message, 'video');
            const caption = content.videoMessage?.caption || '';
            await conn.sendMessage(userJid, {
                video: buffer,
                caption: `🎥 *Channel Video*\n\n${caption}\n\n🔗 ${CHANNEL_INFO.LINK}`
            });
        }
        
        // Audio/Voice message
        else if (msgType === 'audioMessage') {
            const buffer = await downloadMedia(conn, message, 'audio');
            await conn.sendMessage(userJid, {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: content.audioMessage?.ptt || false
            });
        }
        
        // Document
        else if (msgType === 'documentMessage') {
            const buffer = await downloadMedia(conn, message, 'document');
            const filename = content.documentMessage?.fileName || 'document';
            await conn.sendMessage(userJid, {
                document: buffer,
                fileName: filename,
                caption: `📄 *Channel Document*\n\n🔗 ${CHANNEL_INFO.LINK}`
            });
        }
        
        botState.forwardedCount++;
        logger.success(`Forwarded message to ${userJid.split('@')[0]}`);
        
    } catch (err) {
        logger.error(`Forward failed: ${err.message}`);
    }
}

/**
 * Download media from message
 */
async function downloadMedia(conn, message, type) {
    const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
    const stream = await downloadContentFromMessage(
        message.message[type + 'Message'],
        type
    );
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

// ═══════════════════════════════════════════════════════════════════════
//  🤖 MAIN INITIALIZER
// ═══════════════════════════════════════════════════════════════════════

async function arslanmd(conn) {
    logger.info('Initializing Channel Forwarding Bot...');
    
    try {
        // Track connected user
        const botJid = conn.user.id;
        const userNumber = botJid.split(':')[0].split('@')[0];
        botState.connectedUsers.add(userNumber);
        
        // Connection handler
        conn.ev.on('connection.update', (update) => {
            const { connection } = update;
            
            if (connection === 'open') {
                botState.isConnected = true;
                logger.success(`Bot connected: ${userNumber}`);
                
                // Send welcome to connected user (NOT owner)
                sendWelcomeMessage(conn, botJid);
            }
        });
        
        // Channel message handler - THIS IS THE KEY PART
        conn.ev.on('messages.upsert', async (msg) => {
            try {
                const message = msg.messages[0];
                if (!message.message) return;
                
                const from = message.key.remoteJid;
                
                // Check if message is from YOUR channel
                if (from === CHANNEL_INFO.LID) {
                    logger.info(`Channel message received from ${CHANNEL_INFO.LID}`);
                    
                    // Forward to connected user (NOT owner)
                    await forwardChannelMessage(conn, message, botJid);
                }
                
                // Also handle regular messages
                handleRegularMessages(conn, message, botJid);
                
            } catch (err) {
                logger.error(`Message handler error: ${err.message}`);
            }
        });
        
        logger.success('Channel forwarding system active!');
        logger.info(`Monitoring: ${CHANNEL_INFO.LID}`);
        
    } catch (err) {
        logger.error(`Initialization failed: ${err.message}`);
    }
}

/**
 * Send welcome message to connected user
 */
async function sendWelcomeMessage(conn, userJid) {
    try {
        await conn.sendMessage(userJid, {
            image: { url: CHANNEL_INFO.LOGO },
            caption: `╭────────────────────◇\n│🤖 *Channel Forwarding Bot*\n│\n│✅ *Connected Successfully!*\n│\n│📢 Channel messages will be\n│forwarded to you automatically.\n│\n│🔗 *Your Channel:*\n│${CHANNEL_INFO.LINK}\n╰────────────────────○\n\n*Powered by SANA MD* 🇱🇰`
        });
    } catch (err) {
        logger.error(`Welcome message failed: ${err.message}`);
    }
}

/**
 * Handle regular bot commands
 */
async function handleRegularMessages(conn, message, userJid) {
    try {
        const body = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        
        if (!body.startsWith(config.PREFIX)) return;
        
        const command = body.slice(config.PREFIX.length).trim().split(' ')[0].toLowerCase();
        
        // ping command
        if (command === 'ping') {
            const start = Date.now();
            const reply = await conn.sendMessage(userJid, { text: '⏱️ Testing...' });
            const end = Date.now();
            await conn.sendMessage(userJid, {
                text: `🏓 Pong! ${end - start}ms\n📊 Forwarded: ${botState.forwardedCount}`,
                edit: reply.key
            });
        }
        
        // channel command
        else if (command === 'channel') {
            await conn.sendMessage(userJid, {
                text: `🔗 *Channel Info*\n\nLID: ${CHANNEL_INFO.LID}\nLink: ${CHANNEL_INFO.LINK}\nForwarded: ${botState.forwardedCount} messages`
            });
        }
        
        // status command
        else if (command === 'status' || command === 'stats') {
            await conn.sendMessage(userJid, {
                text: `📊 *Bot Status*\n\n⏱️ Uptime: ${formatUptime(Date.now() - botState.startTime)}\n📨 Forwarded: ${botState.forwardedCount}\n👥 Connected Users: ${botState.connectedUsers.size}\n🔗 Channel: ${CHANNEL_INFO.LINK}`
            });
        }
        
    } catch (err) {
        logger.error(`Command handler error: ${err.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  📦 EXPORTS
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
    arslanmd,
    botState,
    CHANNEL_INFO,
    logger
};

logger.info('Channel Forwarding System Loaded');
logger.info(`Target: ${CHANNEL_INFO.LID}`);

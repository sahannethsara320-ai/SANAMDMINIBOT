// ═══════════════════════════════════════════════════════════════════════════
//  ███████╗ █████╗ ███╗   ██╗ █████╗     ███╗   ███╗██████╗ 
//  ██╔════╝██╔══██╗████╗  ██║██╔══██╗    ████╗ ████║██╔══██╗
//  ███████╗███████║██╔██╗ ██║███████║    ██╔████╔██║██║  ██║
//  ╚════██║██╔══██║██║╚██╗██║██╔══██║    ██║╚██╔╝██║██║  ██║
//  ███████║██║  ██║██║  ████║██║  ██║    ██║ ╚═╝ ██║██████╔╝
//  ╚══════╝╚═╝  ╚═╝╚═╝   ╚═══╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═════╝ 
// ═══════════════════════════════════════════════════════════════════════════
//                    SANA MD MINI BOT - FULL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const moment = require('moment-timezone');
const crypto = require('crypto');
const config = require('../config');

// ═══════════════════════════════════════════════════════════════════════
//  🔗 YOUR CHANNEL & LOGO
// ═══════════════════════════════════════════════════════════════════════

const BOT_INFO = {
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029Vb7x5E817En3hMhKxf36',
    LOGO_URL: 'https://i.postimg.cc/dtfrgJRn/download-(6).jpg',
    BOT_NAME: 'SANA MD MINI BOT',
    VERSION: '2.0.0'
};

// ═══════════════════════════════════════════════════════════════════════
//  🔄 STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

const botState = {
    startTime: Date.now(),
    messageCount: 0,
    commandCount: 0,
    statusViewCount: 0,
    groupCount: 0,
    isConnected: false,
    bioInterval: null,
    aliveInterval: null,
    plugins: new Map(),
    commands: new Map(),
    aliases: new Map()
};

// ═══════════════════════════════════════════════════════════════════════
//  📝 LOGGER UTILITY
// ═══════════════════════════════════════════════════════════════════════

const logger = {
    info: (msg) => console.log(`\x1b[36m[${getTime()}] ℹ️  ${msg}\x1b[0m`),
    success: (msg) => console.log(`\x1b[32m[${getTime()}] ✅ ${msg}\x1b[0m`),
    error: (msg) => console.log(`\x1b[31m[${getTime()}] ❌ ${msg}\x1b[0m`),
    warning: (msg) => console.log(`\x1b[33m[${getTime()}] ⚠️  ${msg}\x1b[0m`),
    debug: (msg) => console.log(`\x1b[35m[${getTime()}] 🐛 ${msg}\x1b[0m`)
};

function getTime() {
    return moment().format('HH:mm:ss');
}

// ═══════════════════════════════════════════════════════════════════════
//  🔧 UTILITY FUNCTIONS
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

function getStats() {
    return {
        uptime: formatUptime(Date.now() - botState.startTime),
        messages: botState.messageCount,
        commands: botState.commandCount,
        statusViews: botState.statusViewCount,
        groups: botState.groupCount
    };
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function createSerial(length = 16) {
    return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}

// ═══════════════════════════════════════════════════════════════════════
//  🎨 MESSAGE FORMATTERS
// ═══════════════════════════════════════════════════════════════════════

const MessageTemplates = {
    alive: () => `
╭────────────────────◇
│✦ *${BOT_INFO.BOT_NAME} — ACTIVE* 🔥
│✦ ⏱️ Uptime: ${getStats().uptime}
│✦ 💬 Messages: ${botState.messageCount}
│✦ ⚡ Commands: ${botState.commandCount}
│✦ 📊 Status: ${botState.isConnected ? '🟢 Online' : '🔴 Offline'}
│✦ 🔗 Channel: ${BOT_INFO.CHANNEL_LINK}
╰────────────────────○
*© Powered by SANA MD* 🇱🇰`,

    menu: (prefix) => `
╭────────────────────◇
│  🤖 *${BOT_INFO.BOT_NAME}* 
│  *Command Menu* 📜
├────────────────────◇
│ *📥 Download Commands*
│ • ${prefix}song <name>
│ • ${prefix}video <name>
│ • ${prefix}fb <url>
│ • ${prefix}ig <url>
│ • ${prefix}tt <url>
│ • ${prefix}ytmp3 <url>
│ • ${prefix}ytmp4 <url>
│ • ${prefix}apk <name>
├────────────────────◇
│ *🛠️ Utility Commands*
│ • ${prefix}alive - Check status
│ • ${prefix}ping - Bot speed
│ • ${prefix}menu - Show commands
│ • ${prefix}ss <url> - Screenshot
│ • ${prefix}attp <text> - Text sticker
├────────────────────◇
│ *👥 Group Commands*
│ • ${prefix}welcome - Welcome msg
│ • ${prefix}goodbye - Goodbye msg
│ • ${prefix}antidelete - Anti delete
│ • ${prefix}kick @user
│ • ${prefix}promote @user
│ • ${prefix}demote @user
│ • ${prefix}groupinfo
├────────────────────◇
│ *🎨 Media Commands*
│ • ${prefix}sticker - Create sticker
│ • ${prefix}toimg - Sticker to image
│ • ${prefix}tomp3 - Video to audio
│ • ${prefix}vv - View once media
│ • ${prefix}statussave - Save status
├────────────────────◇
│ *🔍 Search Commands*
│ • ${prefix}yts <query>
│ • ${prefix}google <query>
│ • ${prefix}image <query>
│ • ${prefix}wiki <query>
│ • ${prefix}lyrics <song>
├────────────────────◇
│ *👤 Owner Commands*
│ • ${prefix}broadcast
│ • ${prefix}setvar
│ • ${prefix}getvar
│ • ${prefix}restart
│ • ${prefix}update
│ • ${prefix}block
│ • ${prefix}unblock
╰────────────────────○
*Prefix: ${prefix}* | *Mode: ${config.WORK_TYPE}*
*🔗 Channel: ${BOT_INFO.CHANNEL_LINK}*
*© Powered by SANA MD* 🇱🇰`,

    welcome: (name, group) => `
👋 *Welcome to ${group}* 🎉

╭────────────────────◇
│ *Name:* @${name}
│ *Group:* ${group}
├────────────────────◇
│ 📜 *Group Rules:*
│ • Be respectful to everyone
│ • No spam or promotions
│ • Use bot with prefix: ${config.PREFIX}
│ • Have fun! 🎊
╰────────────────────○

🔗 *Channel:* ${BOT_INFO.CHANNEL_LINK}
*© ${BOT_INFO.BOT_NAME}* 🤖`,

    goodbye: (name) => `
👋 *Goodbye @${name}* 😢

We hope you enjoyed your stay!
Feel free to return anytime.

🔗 *Channel:* ${BOT_INFO.CHANNEL_LINK}
*© ${BOT_INFO.BOT_NAME}* 🤖`,

    status: () => `
╭────────────────────◇
│  📊 *BOT STATISTICS*
├────────────────────◇
│ ⏱️ Uptime: ${getStats().uptime}
│ 💬 Messages: ${botState.messageCount}
│ ⚡ Commands: ${botState.commandCount}
│ 👥 Groups: ${botState.groupCount}
│ 👁️ Status Views: ${botState.statusViewCount}
├────────────────────◇
│ 🔗 *Channel:* 
│ ${BOT_INFO.CHANNEL_LINK}
╰────────────────────○
*© Powered by SANA MD* 🇱🇰`
};

// ═══════════════════════════════════════════════════════════════════════
//  📊 DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════

const Database = {
    data: new Map(),
    
    set: (key, value) => {
        Database.data.set(key, value);
        return true;
    },
    
    get: (key) => {
        return Database.data.get(key);
    },
    
    delete: (key) => {
        return Database.data.delete(key);
    },
    
    has: (key) => {
        return Database.data.has(key);
    },
    
    push: (key, value) => {
        const arr = Database.get(key) || [];
        arr.push(value);
        Database.set(key, arr);
        return true;
    },
    
    getAll: () => {
        return Object.fromEntries(Database.data);
    }
};

// ═══════════════════════════════════════════════════════════════════════
//  🔐 SECURITY FEATURES
// ═══════════════════════════════════════════════════════════════════════

function isBlocked(user) {
    const blockedList = Database.get('blocked') || [];
    return blockedList.includes(user);
}

function blockUser(user) {
    const blockedList = Database.get('blocked') || [];
    if (!blockedList.includes(user)) {
        blockedList.push(user);
        Database.set('blocked', blockedList);
        return true;
    }
    return false;
}

function unblockUser(user) {
    const blockedList = Database.get('blocked') || [];
    const index = blockedList.indexOf(user);
    if (index > -1) {
        blockedList.splice(index, 1);
        Database.set('blocked', blockedList);
        return true;
    }
    return false;
}

function isAdmin(jid, participants) {
    if (!participants) return false;
    const participant = participants.find(p => p.id === jid);
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
}

// ═══════════════════════════════════════════════════════════════════════
//  🎯 COMMAND REGISTRATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════

class Command {
    constructor(name, options = {}) {
        this.name = name;
        this.pattern = options.pattern || name;
        this.alias = options.alias || [];
        this.desc = options.desc || 'No description';
        this.category = options.category || 'misc';
        this.react = options.react || '';
        this.usage = options.usage || `${config.PREFIX}${name}`;
        this.isOwner = options.isOwner || false;
        this.isGroup = options.isGroup || false;
        this.isAdmin = options.isAdmin || false;
        this.function = options.function || (() => {});
    }
}

function registerCommand(name, options) {
    const cmd = new Command(name, options);
    botState.commands.set(cmd.pattern, cmd);
    
    // Register aliases
    if (cmd.alias && Array.isArray(cmd.alias)) {
        cmd.alias.forEach(alias => {
            botState.aliases.set(alias, cmd.pattern);
        });
    }
    
    logger.debug(`Command registered: ${name}`);
    return cmd;
}

function getCommand(name) {
    const direct = botState.commands.get(name);
    if (direct) return direct;
    
    const aliased = botState.aliases.get(name);
    if (aliased) return botState.commands.get(aliased);
    
    return null;
}

// ═══════════════════════════════════════════════════════════════════════
//  🤖 CORE BOT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

async function autoBioUpdate(conn) {
    if (config.AUTO_BIO !== 'true') return;
    
    const updateBio = async () => {
        try {
            const uptime = formatUptime(Date.now() - botState.startTime);
            const bio = `🤖 ${BOT_INFO.BOT_NAME} | ⏱️ ${uptime} | 📞 ${config.OWNER_NUMBER} | 🔗 ${BOT_INFO.CHANNEL_LINK}`;
            await conn.updateProfileStatus(bio);
            logger.info('Bio updated');
        } catch (err) {
            logger.error(`Bio update failed: ${err.message}`);
        }
    };
    
    botState.bioInterval = setInterval(updateBio, 5 * 60 * 1000);
    updateBio();
}

async function aliveScheduler(conn) {
    const sendAlive = async () => {
        try {
            const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';
            await conn.sendMessage(ownerJid, {
                image: { url: BOT_INFO.LOGO_URL },
                caption: MessageTemplates.alive()
            });
            logger.info('Alive message sent');
        } catch (err) {
            logger.error(`Alive message failed: ${err.message}`);
        }
    };
    
    botState.aliveInterval = setInterval(sendAlive, 60 * 60 * 1000);
}

async function setupGroupEvents(conn) {
    conn.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update;
            
            if (config.WELCOME_ENABLE === 'true' && action === 'add') {
                for (const participant of participants) {
                    const user = participant.split('@')[0];
                    const metadata = await conn.groupMetadata(id);
                    const welcomeMsg = config.WELCOME_MSG || MessageTemplates.welcome(user, metadata.subject);
                    
                    await conn.sendMessage(id, {
                        text: welcomeMsg,
                        mentions: [participant],
                        contextInfo: {
                            externalAdReply: {
                                title: BOT_INFO.BOT_NAME,
                                body: 'Welcome!',
                                thumbnailUrl: BOT_INFO.LOGO_URL,
                                sourceUrl: BOT_INFO.CHANNEL_LINK
                            }
                        }
                    });
                }
            }
            
            if (config.GOODBYE_ENABLE === 'true' && action === 'remove') {
                for (const participant of participants) {
                    const user = participant.split('@')[0];
                    const goodbyeMsg = config.GOODBYE_MSG || MessageTemplates.goodbye(user);
                    
                    await conn.sendMessage(id, {
                        text: goodbyeMsg,
                        mentions: [participant]
                    });
                }
            }
        } catch (err) {
            logger.error(`Group event error: ${err.message}`);
        }
    });
}

async function handleConnection(conn) {
    conn.ev.on('connection.update', (update) => {
        const { connection } = update;
        
        if (connection === 'open') {
            botState.isConnected = true;
            logger.success(`${BOT_INFO.BOT_NAME} connected!`);
        } else if (connection === 'close') {
            botState.isConnected = false;
            logger.warning('Bot disconnected');
            
            if (botState.bioInterval) clearInterval(botState.bioInterval);
            if (botState.aliveInterval) clearInterval(botState.aliveInterval);
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════
//  🚀 MAIN INITIALIZER
// ═══════════════════════════════════════════════════════════════════════

async function arslanmd(conn) {
    logger.info(`Initializing ${BOT_INFO.BOT_NAME} v${BOT_INFO.VERSION}...`);
    
    try {
        // Setup handlers
        await handleConnection(conn);
        await autoBioUpdate(conn);
        await setupGroupEvents(conn);
        await aliveScheduler(conn);
        
        // Message counter
        conn.ev.on('messages.upsert', () => {
            botState.messageCount++;
        });
        
        // Register built-in commands
        registerBuiltInCommands(conn);
        
        logger.success(`${BOT_INFO.BOT_NAME} initialized!`);
        logger.info(`Channel: ${BOT_INFO.CHANNEL_LINK}`);
        
        // Send startup message to owner
        const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';
        await conn.sendMessage(ownerJid, {
            image: { url: BOT_INFO.LOGO_URL },
            caption: `╭────────────────────◇\n│✦ *${BOT_INFO.BOT_NAME}* 🔥\n│✦ *Version:* ${BOT_INFO.VERSION}\n│✦ *Status:* Connected ✅\n│✦ *Prefix:* ${config.PREFIX}\n│✦ *Mode:* ${config.WORK_TYPE}\n├────────────────────◇\n│🔗 *Channel:*\n│${BOT_INFO.CHANNEL_LINK}\n╰────────────────────○\n\n*Bot is ready to use!* 🤖`
        });
        
        return true;
    } catch (err) {
        logger.error(`Initialization failed: ${err.message}`);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  📝 BUILT-IN COMMANDS
// ═══════════════════════════════════════════════════════════════════════

function registerBuiltInCommands(conn) {
    // alive command
    registerCommand('alive', {
        pattern: 'alive',
        desc: 'Check if bot is online',
        category: 'info',
        react: '✅',
        function: async (conn, mek, m, ctx) => {
            await conn.sendMessage(ctx.from, {
                image: { url: BOT_INFO.LOGO_URL },
                caption: MessageTemplates.alive()
            }, { quoted: mek });
        }
    });
    
    // menu command
    registerCommand('menu', {
        pattern: 'menu',
        alias: ['help', 'commands', 'cmd'],
        desc: 'Show all commands',
        category: 'info',
        react: '📜',
        function: async (conn, mek, m, ctx) => {
            await conn.sendMessage(ctx.from, {
                image: { url: BOT_INFO.LOGO_URL },
                caption: MessageTemplates.menu(config.PREFIX),
                contextInfo: {
                    externalAdReply: {
                        title: BOT_INFO.BOT_NAME,
                        body: 'Click to join channel',
                        thumbnailUrl: BOT_INFO.LOGO_URL,
                        sourceUrl: BOT_INFO.CHANNEL_LINK
                    }
                }
            }, { quoted: mek });
        }
    });
    
    // ping command
    registerCommand('ping', {
        pattern: 'ping',
        desc: 'Check bot response speed',
        category: 'info',
        react: '⚡',
        function: async (conn, mek, m, ctx) => {
            const start = Date.now();
            const reply = await conn.sendMessage(ctx.from, {
                text: '⏱️ Testing speed...'
            }, { quoted: mek });
            const end = Date.now();
            
            await conn.sendMessage(ctx.from, {
                text: `🏓 *Pong!*\n\n⚡ Speed: ${end - start}ms\n⏱️ Uptime: ${getStats().uptime}\n💻 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
                edit: reply.key
            });
        }
    });
    
    // status command
    registerCommand('status', {
        pattern: 'status',
        alias: ['stats', 'botstatus'],
        desc: 'Show bot statistics',
        category: 'info',
        react: '📊',
        function: async (conn, mek, m, ctx) => {
            await conn.sendMessage(ctx.from, {
                text: MessageTemplates.status()
            }, { quoted: mek });
        }
    });
    
    // channel command
    registerCommand('channel', {
        pattern: 'channel',
        desc: 'Get channel link',
        category: 'info',
        react: '🔗',
        function: async (conn, mek, m, ctx) => {
            await conn.sendMessage(ctx.from, {
                text: `🔗 *${BOT_INFO.BOT_NAME} Channel*\n\n${BOT_INFO.CHANNEL_LINK}\n\n*Join for updates!* ✅`
            }, { quoted: mek });
        }
    });
    
    // owner command
    registerCommand('owner', {
        pattern: 'owner',
        alias: ['creator', 'developer'],
        desc: 'Show owner info',
        category: 'info',
        react: '👤',
        function: async (conn, mek, m, ctx) => {
            await conn.sendMessage(ctx.from, {
                text: `👤 *Owner Information*\n\n📞 Number: ${config.OWNER_NUMBER}\n🔰 Bot: ${BOT_INFO.BOT_NAME}\n📡 Channel: ${BOT_INFO.CHANNEL_LINK}\n\n*Powered by SANA MD* 🇱🇰`
            }, { quoted: mek });
        }
    });
    
    // block command (owner only)
    registerCommand('block', {
        pattern: 'block',
        desc: 'Block a user',
        category: 'owner',
        isOwner: true,
        function: async (conn, mek, m, ctx) => {
            if (!ctx.args[0]) return ctx.reply('❌ Please provide a number');
            const user = ctx.args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            if (blockUser(user)) {
                await ctx.reply(`🚫 Blocked: ${ctx.args[0]}`);
            } else {
                await ctx.reply(`⚠️ Already blocked or error`);
            }
        }
    });
    
    // unblock command (owner only)
    registerCommand('unblock', {
        pattern: 'unblock',
        desc: 'Unblock a user',
        category: 'owner',
        isOwner: true,
        function: async (conn, mek, m, ctx) => {
            if (!ctx.args[0]) return ctx.reply('❌ Please provide a number');
            const user = ctx.args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            if (unblockUser(user)) {
                await ctx.reply(`✅ Unblocked: ${ctx.args[0]}`);
            } else {
                await ctx.reply(`⚠️ Not blocked or error`);
            }
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════
//  📦 EXPORTS
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
    arslanmd,
    botState,
    logger,
    getStats,
    formatUptime,
    Database,
    Command,
    registerCommand,
    getCommand,
    isBlocked,
    blockUser,
    unblockUser,
    isAdmin,
    random,
    createSerial,
    MessageTemplates,
    BOT_INFO
};

// ═══════════════════════════════════════════════════════════════════════
//  🏷️ MODULE INFO
// ═══════════════════════════════════════════════════════════════════════

logger.info('═════════════════════════════════════');
logger.info(`${BOT_INFO.BOT_NAME} System Loaded`);
logger.info(`Version: ${BOT_INFO.VERSION}`);
logger.info(`Channel: ${BOT_INFO.CHANNEL_LINK}`);
logger.info('═════════════════════════════════════');

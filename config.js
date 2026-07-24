// ═══════════════════════════════════════════════════════════════════════════
//  ███████╗ █████╗ ███╗   ██╗ █████╗     ███╗   ███╗██████╗ 
//  ██╔════╝██╔══██╗████╗  ██║██╔══██╗    ████╗ ████║██╔══██╗
//  ███████╗███████║██╔██╗ ██║███████║    ██╔████╔██║██║  ██║
//  ╚════██║██╔══██║██║╚██╗██║██╔══██║    ██║╚██╔╝██║██║  ██║
//  ███████║██║  ██║██║  ████║██║  ██║    ██║ ╚═╝ ██║██████╔╝
//  ╚══════╝╚═╝  ╚═╝╚═╝   ╚═══╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═════╝ 
// ═══════════════════════════════════════════════════════════════════════════
//                    SANA MD MINI BOT - CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const dotenv = require('dotenv');

// ────────────────────────────────────────────────────────────────────────────
//  🔄 ENVIRONMENT LOADER
// ────────────────────────────────────────────────────────────────────────────
if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

// ────────────────────────────────────────────────────────────────────────────
//  📦 CONFIGURATION EXPORT
// ────────────────────────────────────────────────────────────────────────────
module.exports = {

    // ═══════════════════════════════════════════════════════════════════════
    //  🔐 SESSION & DATABASE
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Session ID for bot authentication and persistence
     * @type {string}
     * @default "SANA-MD-MINI"
     */
    SESSION_ID: process.env.SESSION_ID || "SANA-MD-MINI",
    
    /** 
     * @description MongoDB Atlas connection string
     * @type {string}
     * @default "mongodb+srv://..."
     */
   MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://sahannethsara320_db_user:zxLujfIoprySRKNQ@cluster0.vijh68g.mongodb.net/?appName=Cluster0",


    // ═══════════════════════════════════════════════════════════════════════
    //  🤖 BOT IDENTITY - SANA MD MINI
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Command prefix for bot interactions
     * @type {string}
     * @default "."
     */
    PREFIX: process.env.PREFIX || '.',
    
    /** 
     * @description Owner's WhatsApp number with country code
     * @type {string}
     * @default "94770740571"
     */
    OWNER_NUMBER: process.env.OWNER_NUMBER || '94770740571',
    
    /** 
     * @description Display name of the bot
     * @type {string}
     * @default "SANA MD MINI BOT"
     */
    BOT_NAME: "SANA MD MINI BOT",
    
    /** 
     * @description Footer text for bot messages
     * @type {string}
     * @default "© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴀ ᴍᴅ"
     */
    BOT_FOOTER: '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴀ ᴍᴅ',
    
    /** 
     * @description Bot work mode
     * @type {('public'|'private'|'group'|'inbox')}
     * @default "public"
     * @example
     * - public  : Responds to all messages | සියලු මැසේජ් වලට රිප්ලයි කරයි
     * - private : Only responds in DMs | ප්‍රයිවට් චැට් වලට පමණයි
     * - group   : Only responds in groups | ගෲප් වලට පමණයි
     * - inbox   : Only responds in DMs | ඉන්බොක්ස් වලට පමණයි
     */
    WORK_TYPE: process.env.WORK_TYPE || "public",

    // ═══════════════════════════════════════════════════════════════════════
    //  👁️ STATUS AUTOMATION - ස්ටේටස් ඔටෝමැටික්
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Auto-view WhatsApp status updates
     * @type {string}
     * @default "true"
     */
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true',
    
    /** 
     * @description Auto-like status updates with random emojis
     * @type {string}
     * @default "true"
     */
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true',
    
    /** 
     * @description Emoji pool for auto-like feature
     * @type {string[]}
     */
    AUTO_LIKE_EMOJI: ['❤️', '🌹', '✨', '🥰', '🌹', '😍', '💞', '💕', '☺️', '🤗', '🇱🇰', '🔥'],
    
    /** 
     * @description Auto-reply to status updates
     * @type {string}
     * @default "false"
     */
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'false',
    
    /** 
     * @description Default message for status reply
     * @type {string}
     * @default "🤗 SANA MD බොට් ස්ටේටස් බලාගෙන යනවා 😊"
     */
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || '🤗 SANA MD බොට් ස්ටේටස් බලාගෙන යනවා 😊',

    // ═══════════════════════════════════════════════════════════════════════
    //  💬 PRESENCE & CHAT SETTINGS - චැට් සෙටිංස්
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Mark messages as read (blue ticks)
     * @type {string}
     * @default "false"
     */
    READ_MESSAGE: process.env.READ_MESSAGE || 'false',
    
    /** 
     * @description Show typing indicator in chat
     * @type {string}
     * @default "false"
     */
    AUTO_TYPING: process.env.AUTO_TYPING || 'false',
    
    /** 
     * @description Show recording indicator in chat
     * @type {string}
     * @default "false"
     */
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false',

    // ═══════════════════════════════════════════════════════════════════════
    //  👥 GROUP MANAGEMENT - ගෲප් මැනේජ්මන්ට්
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Send welcome message when new member joins
     * @type {string}
     * @default "true"
     */
    WELCOME_ENABLE: process.env.WELCOME_ENABLE || 'true',
    
    /** 
     * @description Send goodbye message when member leaves
     * @type {string}
     * @default "true"
     */
    GOODBYE_ENABLE: process.env.GOODBYE_ENABLE || 'true',
    
    /** 
     * @description Custom welcome message (null = use default)
     * @type {string|null}
     * @default null
     */
    WELCOME_MSG: process.env.WELCOME_MSG || null,
    
    /** 
     * @description Custom goodbye message (null = use default)
     * @type {string|null}
     * @default null
     */
    GOODBYE_MSG: process.env.GOODBYE_MSG || null,
    
    /** 
     * @description Custom welcome image URL (null = use default)
     * @type {string|null}
     * @default null
     */
    WELCOME_IMAGE: process.env.WELCOME_IMAGE || null,
    
    /** 
     * @description Custom goodbye image URL (null = use default)
     * @type {string|null}
     * @default null
     */
    GOODBYE_IMAGE: process.env.GOODBYE_IMAGE || null,
    
    /** 
     * @description WhatsApp group invite link
     * @type {string}
     */
    GROUP_INVITE_LINK: process.env.GROUP_INVITE_LINK || 'https://chat.whatsapp.com/Jpf5TU6nrwlFcQnW86bR7f',

    // ═══════════════════════════════════════════════════════════════════════
    //  🛡️ SECURITY & ANTI-CALL - කෝල් බ්ලොක්
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Reject incoming calls automatically
     * @type {string}
     * @default "false"
     */
    ANTI_CALL: process.env.ANTI_CALL || 'false',
    
    /** 
     * @description Message sent when rejecting calls
     * @type {string}
     * @default "*කෝල් එකක් ගහන්න එපා බන් 😒🌹*"
     */
    REJECT_MSG: process.env.REJECT_MSG || '*කෝල් එකක් ගහන්න එපා බන් 😒🌹*\n\n📞 Owner: SANA MD\n🔰 Bot: SANA MD MINI BOT',

    // ═══════════════════════════════════════════════════════════════════════
    //  🖼️ MEDIA & LINKS - ලෝගෝ සහ ලින්ක්
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Default bot profile image path/URL
     * @type {string}
     */
    IMAGE_PATH: 'https://i.postimg.cc/dtfrgJRn/download-(6).jpg',
    
    /** 
     * @description WhatsApp channel link for updates
     * @type {string}
     */
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029Vb7x5E817En3hMhKxf36',

    // ═══════════════════════════════════════════════════════════════════════
    //  📡 EXTERNAL API INTEGRATIONS
    // ═══════════════════════════════════════════════════════════════════════
    
    /** 
     * @description Telegram bot token for notifications
     * @type {string}
     * @default "7214172448:..."
     */
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '7214172448:AAHGqSgaw-zGVPZWvl8msDOVDhln-9kExas',
    
    /** 
     * @description Telegram chat ID for sending notifications
     * @type {string}
     * @default "94770740571"
     */
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '94770740571'

};

// ────────────────────────────────────────────────────────────────────────────
//  📖 USAGE EXAMPLES - භාවිතා කරන හැටි
// ────────────────────────────────────────────────────────────────────────────

/**
 * @example
 * // Import configuration
 * const config = require('./config');
 * 
 * // Access bot settings | බොට් සෙටිංස් බලන්න
 * console.log(`Bot: ${config.BOT_NAME}`);
 * console.log(`Prefix: ${config.PREFIX}`);
 * console.log(`Owner: ${config.OWNER_NUMBER}`);
 * 
 * // Check if auto-view status is enabled | ස්ටේටස් ඔටෝ බලනවද?
 * if (config.AUTO_VIEW_STATUS === 'true') {
 *     console.log('Auto-view status is active | ස්ටේටස් ඔටෝ බලනවා');
 * }
 * 
 * // Get random like emoji
 * const randomEmoji = config.AUTO_LIKE_EMOJI[Math.floor(Math.random() * config.AUTO_LIKE_EMOJI.length)];
 */

// ────────────────────────────────────────────────────────────────────────────
//  🏷️ EXPORT METADATA
// ────────────────────────────────────────────────────────────────────────────

/**
 * @module config
 * @description SANA MD MINI BOT Configuration Module
 * @version 2.0.0
 * @author SANA MD
 * @license MIT
 * @contact 94770740571
 */

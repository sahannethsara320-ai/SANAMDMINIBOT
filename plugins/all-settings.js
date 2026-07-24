const { cmd } = require('../arslan');
const { updateUserConfig } = require('../lib/database');

// Helper function to update config in memory and database
const updateConfig = async (key, value, botNumber, config, reply) => {
    try {
        // 1. Update in-memory config (Immediate)
        config[key] = value;
        
        // 2. Update in Database (Persistent)
        const newConfig = { ...config }; 
        newConfig[key] = value;
        
        await updateUserConfig(botNumber, newConfig);
        
        return reply(`✅ *${key}* සාර්ථකව යාවත්කාලීන කරන ලදී: *${value}*`);
    } catch (e) {
        console.error(e);
        return reply("❌ ඩේටාබේස් එකට සේව් කිරීමේදී දෝෂයක් ඇති විය.");
    }
};

// ============================================================
// 1. PRESENCE MANAGEMENT (Recording / Typing)
// ============================================================

cmd({
    pattern: "autorecording",
    alias: ["autorec", "arecording"],
    desc: "Enable/Disable auto recording simulation",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_RECORDING', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_RECORDING', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.AUTO_RECORDING} වේ.*\n\n*Auto Recording සක්‍රීය කිරීමට (On):*\n*👑 ❮.autorecording on❯ 👑*\n\n*Auto Recording අක්‍රීය කිරීමට (Off):*\n*👑 ❮.autorecording off❯ 👑*`);
    }
});

cmd({
    pattern: "autotyping",
    alias: ["autotype", "atyping"],
    desc: "Enable/Disable auto typing simulation",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_TYPING', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_TYPING', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.AUTO_TYPING} වේ.*\n\n*Auto Typing සක්‍රීය කිරීමට (On):*\n*👑 ❮.autotyping on❯ 👑*\n\n*Auto Typing අක්‍රීය කිරීමට (Off):*\n*👑 ❮.autotyping off❯ 👑*`);
    }
});

// ============================================================
// 2. CALL MANAGEMENT (Anti-Call)
// ============================================================

cmd({
    pattern: "anticall",
    alias: "acall",
    desc: "Auto reject calls",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('ANTI_CALL', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('ANTI_CALL', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.ANTI_CALL || 'false'} වේ.*\n\n*මෙමඟින් බොට්ට ගන්නා සියලුම කෝල් ස්වයංක්‍රීයව විසන්ධි (Reject) කරනු ලබයි. 😃*\n\n*Anti-Call සක්‍රීය කිරීමට (On):*\n*👑 ❮.anticall on❯ 👑*\n\n*Anti-Call අක්‍රීය කිරීමට (Off):*\n*👑 ❮.anticall off❯ 👑*`);
    }
});

// ============================================================
// 3. GROUP MANAGEMENT (Welcome / Goodbye)
// ============================================================

cmd({
    pattern: "welcome",
    desc: "Enable/Disable welcome messages",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('WELCOME', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('WELCOME', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.WELCOME} වේ.*\n\n*ගෘප් එකට අලුතින් පැමිණෙන සාමාජිකයන් පිළිගැනීමේ මැසේජ් එක සක්‍රීය කිරීමට (On):*\n*👑 ❮.welcome on❯ 👑*\n\n*අක්‍රීය කිරීමට (Off):*\n*👑 ❮.welcome off❯ 👑*`);
    }
});

cmd({
    pattern: "goodbye",
    desc: "Enable/Disable goodbye messages",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('GOODBYE', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('GOODBYE', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.GOODBYE} වේ.*\n\n*ගෘප් එකෙන් අයින් වන සාමාජිකයන්ට සමුදීමේ මැසේජ් එක සක්‍රීය කිරීමට (On):*\n*👑 ❮.goodbye on❯ 👑*\n\n*අක්‍රීය කිරීමට (Off):*\n*👑 ❮.goodbye off❯ 👑*`);
    }
});

// ============================================================
// 4. READ & STATUS MANAGEMENT
// ============================================================

cmd({
    pattern: "autoread",
    desc: "Enable/Disable auto read messages (Blue Tick)",
    category: "settings",
    react: "👀"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('READ_MESSAGE', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('READ_MESSAGE', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.READ_MESSAGE} වේ.*\n\n*ලැබෙන සියලුම පණිවිඩ ස්වයංක්‍රීයව කියවීමට (Blue Tick On):*\n*👑 ❮.autoread on❯ 👑*\n\n*අක්‍රීය කිරීමට (Off):*\n*👑 ❮.autoread off❯ 👑*`);
    }
});

cmd({
    pattern: "autoviewsview",
    alias: ["avs", "statusseen", "astatus"],
    desc: "Auto view status updates",
    category: "settings",
    react: "😎"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_VIEW_STATUS', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_VIEW_STATUS', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.AUTO_VIEW_STATUS} වේ.*\n\n*සියලුම WhatsApp Status ස්වයංක්‍රීයව නැරඹීමට (Auto Status Seen On):*\n*👑 ❮.autoviewsview on❯ 👑*\n\n*අක්‍රීය කිරීමට (Off):*\n*👑 ❮.autoviewsview off❯ 👑*`);
    }
});

cmd({
    pattern: "autelikestatus",
    alias: ["als"],
    desc: "Auto like status updates",
    category: "settings",
    react: "❤️"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_LIKE_STATUS', 'true', botNumber, config, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_LIKE_STATUS', 'false', botNumber, config, reply);
    } else {
        reply(`*📊 වත්මන් තත්ත්වය: ❯ ${config.AUTO_LIKE_STATUS} වේ.*\n\n*Status වලට ස්වයංක්‍රීයව React කිරීමට (Auto Status Like On):*\n*👑 ❮.autelikestatus on❯ 👑*\n\n*අක්‍රීය කිරීමට (Off):*\n*👑 ❮.autelikestatus off❯ 👑*`);
    }
});

// ============================================================
// 5. SYSTEM (Mode & Prefix)
// ============================================================

cmd({
    pattern: "mode",
    desc: "Change bot mode (public/private/groups/inbox)",
    category: "settings",
    react: "⚙️"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const mode = args[0]?.toLowerCase();
    const validModes = ['public', 'private', 'groups', 'inbox'];

    if (validModes.includes(mode)) {
        await updateConfig('WORK_TYPE', mode, botNumber, config, reply);
    } else {
        reply(`*❌ ලබාදුන් Mode එක වැරදියි! 🥺*\n\n*භාවිතය:*\n.mode <යටින් ඇති එක වචනයක්>\n\n*තෝරාගත හැකි Modes:*\n${validModes.join(', ')}\n\n📊 වත්මන් තත්ත්වය (Current): ${config.WORK_TYPE}`);
    }
});

cmd({
    pattern: "setprefix",
    desc: "Change bot prefix",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, config }) => {
    if (!isOwner) return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    const newPrefix = args[0];

    if (newPrefix) {
        if (newPrefix.length > 1 && newPrefix !== 'noprefix') return reply("❌ Prefix එක කෙටි ලකුණක් විය යුතුය (උදා: . හෝ ! හෝ #)");
        
        await updateConfig('PREFIX', newPrefix, botNumber, config, reply);
    } else {
        reply(`*👑 වත්මන් Prefix එක: ❮ ${config.PREFIX} ❯ වේ.*\n\nබොට් ක්‍රියාත්මක කිරීමට අවශ්‍ය ලකුණ වෙනස් කිරීමට මෙලෙස ටයිප් කරන්න:\n*❮ .setprefix ! ❯* හෝ *❮ .setprefix # ❯*`);
    }
});

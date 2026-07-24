const { cmd } = require('../arslan');
const { setAntideleteStatus, getAntideleteStatus } = require('../data/Antidelete');

cmd({
    pattern: "antidelete",
    alias: ["antidel"],
    desc: "Turn Antidelete on/off",
    category: "owner",
    react: "🛡️"
},
async(conn, mek, m, { args, isOwner, reply, from }) => {
    // 🔐 Owner only Check
    if (!isOwner) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command is only for my owner (SANA MD)!*\n(මෙය භාවිතා කිරීමට බොට් අයිතිකරුට පමණක් අවසර ඇත.)");
    
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'enable') {
        await setAntideleteStatus(from, true);
        await reply("✨ *SANA MD MINI BOT* ✨\n\n🛡️ *ANTI-DELETE ACTIVATED SUCCESSFULLY!*\n(මකා දමන පණිවිඩ සුරැකීමේ විශේෂාංගය සක්‍රීය කරන ලදී!)");
    } else if (mode === 'off' || mode === 'disable') {
        await setAntideleteStatus(from, false);
        await reply("✨ *SANA MD MINI BOT* ✨\n\n🛡️ *ANTI-DELETE DE-ACTIVATED SUCCESSFULLY!*\n(මකා දමන පණිවිඩ සුරැකීමේ විශේෂාංගය අක්‍රීය කරන ලදී!)");
    } else {
        const current = await getAntideleteStatus(from);
        await reply(
            `✨ *SANA MD MINI BOT - ANTI DELETE* ✨\n\n` +
            `*Usage (භාවිතා කරන ක්‍රමය):*\n` +
            `➤ *.antidelete on* (සක්‍රීය කිරීමට)\n` +
            `➤ *.antidelete off* (අක්‍රීය කිරීමට)\n\n` +
            `📌 *Current Status:* ${current ? "ON ✅" : "OFF ❌"}`
        );
    }
});

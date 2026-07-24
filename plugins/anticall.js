const { cmd } = require('../arslan');
const config = require('../config');


cmd({
    pattern: "anti-call",
    react: "🛡️",
    alias: ["anticall"],
    desc: "Enable or disable anti-call function to reject calls automatically",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    // 🔐 Owner only Check
    if (!isCreator) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command is only for my owner (SANA MD)!*\n(මෙය භාවිතා කිරීමට බොට් අයිතිකරුට පමණක් අවසර ඇත.)");

    const status = args[0]?.toLowerCase();
    if (status === "on" || status === "enable") {
        config.ANTI_CALL = "true";
        return reply("✨ *SANA MD MINI BOT* ✨\n\n📞 *ANTI-CALL ACTIVATED SUCCESSFULLY!*\n(ඇමතුම් ස්වයංක්‍රීයව ප්‍රතික්ෂේප කිරීමේ විශේෂාංගය සක්‍රීය කරන ලදී!)");
    } else if (status === "off" || status === "disable") {
        config.ANTI_CALL = "false";
        return reply("✨ *SANA MD MINI BOT* ✨\n\n📞 *ANTI-CALL DE-ACTIVATED SUCCESSFULLY!*\n(ඇමතුම් ස්වයංක්‍රීයව ප්‍රතික්ෂේප කිරීමේ විශේෂාංගය අක්‍රීය කරන ලදී!)");
    } else {
        return reply(
            `✨ *SANA MD MINI BOT - ANTI CALL* ✨\n\n` +
            `*Usage (භාවිතා කරන ක්‍රමය):*\n` +
            `➤ *.anti-call on* (සක්‍රීය කිරීමට)\n` +
            `➤ *.anti-call off* (අක්‍රීය කිරීමට)\n\n` +
            `📌 *Current Config:* ${config.ANTI_CALL === "true" ? "ON ✅" : "OFF ❌"}`
        );
    }
});

const { cmd } = require("../arslan");

cmd({
    pattern: "getjid",
    alias: ["channeljid", "jid"],
    desc: "Get WhatsApp Channel JID",
    category: "system",
    react: "🆔",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    try {
        const jid = mek?.key?.remoteJid;

        if (!jid) {
            return reply("❌ JID එක හොයාගන්න බැරි වුණා.");
        }

        if (!jid.endsWith("@newsletter")) {
            return reply(
                `❌ මේක WhatsApp Channel message එකක් නෙවෙයි.\n\n` +
                `📌 Detected JID:\n${jid}\n\n` +
                `Channel message එකකට reply කරලා .getjid යවන්න.`
            );
        }

        return reply(
            `╭───〔 📢 CHANNEL JID 〕───╮\n` +
            `│\n` +
            `│ 🆔 JID:\n` +
            `│ ${jid}\n` +
            `│\n` +
            `│ ✅ Channel JID detected!\n` +
            `╰──────────────────────╯`
        );

    } catch (error) {
        console.error("GetJID Error:", error);
        return reply("❌ JID ලබාගැනීමේදී error එකක් ආවා.");
    }
});

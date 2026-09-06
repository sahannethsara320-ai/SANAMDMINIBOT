const { cmd } = require("../arslan");

cmd({
    pattern: "getjid",
    alias: ["channeljid", "jid"],
    desc: "Get WhatsApp Channel JID",
    category: "tool",
    react: "🆔",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    try {
        const jid = mek?.key?.remoteJid;

        // JID එක නැත්නම්
        if (!jid) {
            return reply("❌ JID එක හොයාගන්න බැරි වුණා.");
        }

        // Channel JID එකක්ද බලන්න
        if (!jid.endsWith("@newsletter")) {
            return reply(
                `❌ මේක WhatsApp Channel message එකක් නෙවෙයි.\n\n` +
                `📌 Detected JID:\n${jid}\n\n` +
                `Channel message එකකට reply කරලා .getjid යවන්න.`
            );
        }

        // ==============================
        // CHANNEL JID BOX
        // ==============================

        const title = "📢 CHANNEL JID";
        const jidText = `🆔 JID: ${jid}`;
        const status = "✅ SANA MD Channel JID detected!";

        // Longest text එක හොයාගන්න
        const width = Math.max(
            [...title].length,
            [...jidText].length,
            [...status].length
        );

        // Box borders
        const top = `+${"-".repeat(width + 2)}+`;
        const empty = `|${" ".repeat(width + 2)}|`;

        // Final message
        return reply(
` \`\`\`
${top}
| ${title.padEnd(width)} |
${top}
| ${jidText.padEnd(width)} |
${empty}
| ${status.padEnd(width)} |
${top}
\`\`\``
        );

    } catch (error) {
        console.error("GetJID Error:", error);

        return reply(
            "❌ JID ලබාගැනීමේදී error එකක් ආවා."
        );
    }
});

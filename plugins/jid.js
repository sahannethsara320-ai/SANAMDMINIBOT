const { cmd } = require("../command");

cmd({
    pattern: "jid",
    desc: "Get WhatsApp Channel JID",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply("දාන්න:\n.channeljid https://whatsapp.com/channel/XXXXXXXXXXXX");
        }

        const invite = args[0].split("/").pop();

        const meta = await conn.newsletterMetadata("invite", invite);

        reply(`📢 *Channel:* ${meta.name}\n🆔 *JID:* ${meta.id}`);
    } catch (e) {
        console.log(e);
        reply("❌ Channel JID ගන්න බැරි වුණා.");
    }
});

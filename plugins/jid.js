const { cmd } = require("../arslan");

cmd({
    pattern: "jid",
    desc: "Find WhatsApp JID",
    category: "tools",
    react: "🆔",
    filename: __filename
}, async (conn, mek, m, { reply, text, from }) => {
    try {

        if (!text) {
            return reply(`📌 *JID FINDER*

Examples:

.jid 94771234567

.jid https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv

.jid https://whatsapp.com/channel/0029VaXXXXXXXXXXX`);
        }

        // PHONE NUMBER
        if (/^\d+$/.test(text.replace(/\+/g, ""))) {

            let num = text.replace(/\D/g, "");

            if (!num.startsWith("0") && !num.startsWith("94")) {
                num = "94" + num;
            }

            if (num.startsWith("0")) {
                num = "94" + num.slice(1);
            }

            return reply(`📱 *PHONE NUMBER*

Number : ${num}

JID :
${num}@s.whatsapp.net`);
        }

        // GROUP LINK
        if (text.includes("chat.whatsapp.com")) {

            const code = text.split("/").pop().trim();

            const data = await conn.groupAcceptInvite(code);

            await conn.groupLeave(data);

            return reply(`👥 *GROUP JID*

${data}`);
        }

        // CHANNEL LINK
        if (text.includes("whatsapp.com/channel")) {

            const meta = await conn.newsletterMetadata("invite", text);

            return reply(`📢 *CHANNEL INFO*

Name :
${meta.name}

JID :
${meta.id}`);
        }

        reply("❌ Invalid phone number or WhatsApp link.");

    } catch (e) {
        console.log(e);

        reply(`❌ Error

${e.message}`);
    }
});

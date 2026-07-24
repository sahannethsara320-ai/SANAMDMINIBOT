const { cmd } = require("../arslan");

cmd({
    pattern: "groupstatus",
    alias: ["gstatus", "poststatus", "statuspost"],
    desc: "Post text or media to WhatsApp Status",
    category: "group",
    react: "📡",
    filename: __filename
},
async (conn, mek, m, { body, reply, pushname }) => {
    try {

        const caption = body.split(" ").slice(1).join(" ");

        // TEXT STATUS
        if (!m.quoted && caption) {

            await conn.sendMessage(
                "status@broadcast",
                {
                    text:
`╭━━〔 ꜱᴀɴᴀ-ᴍᴅ-ᴍɪɴɪ 〕━━⬣
┃ 👤 User : ${pushname}
┃ ⏰ Time : ${new Date().toLocaleString()}
┃
┃ 💬 Message:
┃ ${caption}
╰━━━━━━━━━━━━━━━━⬣`
                }
            );

            return reply("✅ *Text status posted successfully!*\n\n> ස්ටේටස් එක සාර්ථකව පල කරන ලදී.");
        }

        if (!m.quoted) {
            return reply(
                "❌ *Reply to an image, video, audio, or sticker!*\n\n> කරුණාකර ඡායාරූපයකට, වීඩියෝවකට, ඕඩියෝවකට හෝ ස්ටිකරයකට Reply කර මෙම විධානය ලබා දෙන්න.\n\n💡 *Example:* `.groupstatus Hello World`"
            );
        }

        const quoted = m.quoted;
        const media = await quoted.download();

        // IMAGE
        if (quoted.imageMessage) {

            await conn.sendMessage(
                "status@broadcast",
                {
                    image: media,
                    caption:
`📸 *ꜱᴀɴᴀ-ᴍᴅ-ᴍɪɴɪ sᴛᴀᴛᴜs*

👤 *Posted By:* ${pushname}
🕒 *Time:* ${new Date().toLocaleString()}

📝 *Caption:* ${caption || "No Caption"}`
                }
            );

            return reply("✅ *Image status posted successfully!*\n\n> ඡායාරූපය ස්ටේටස් එකට එක් කරන ලදී.");
        }

        // VIDEO
        if (quoted.videoMessage) {

            await conn.sendMessage(
                "status@broadcast",
                {
                    video: media,
                    caption:
`🎥 *...ꜱᴀɴᴀ-ᴍᴅ-ᴍɪɴɪ...*

👤 *Posted By:* ${pushname}
🕒 *Time:* ${new Date().toLocaleString()}

📝 *Caption:* ${caption || "No Caption"}`
                }
            );

            return reply("✅ *Video status posted successfully!*\n\n> වීඩියෝව ස්ටේටස් එකට එක් කරන ලදී.");
        }

        // AUDIO
        if (quoted.audioMessage) {

            await conn.sendMessage(
                "status@broadcast",
                {
                    audio: media,
                    mimetype: "audio/mp4",
                    ptt: false
                }
            );

            return reply("✅ *Audio status posted successfully!*\n\n> හඬ පටය ස්ටේටස් එකට එක් කරන ලදී.");
        }

        // STICKER
        if (quoted.stickerMessage) {

            await conn.sendMessage(
                "status@broadcast",
                {
                    sticker: media
                }
            );

            return reply("✅ *Sticker status posted successfully!*\n\n> ස්ටිකරය ස්ටේටස් එකට එක් කරන ලදී.");
        }

        return reply("❌ *Unsupported media type!*\n\n> මෙම මාධ්‍ය වර්ගය ස්ටේටස් දැමීමට සහය දක්වන්නේ නැත.");

    } catch (err) {
        console.log("GROUPSTATUS ERROR:", err);

        return reply(
`❌ *SANA-MD-MINI STATUS ERROR*

⚠️ *Error:* ${err.message}
> ක්‍රියාවලිය අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.`
        );
    }
});

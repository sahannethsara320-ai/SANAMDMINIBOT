const { cmd } = require("../arslan");
const moment = require("moment");
const { fakevCard } = require('../lib/fakevCard');

let botStartTime = Date.now(); // Recording the start time of the bot

// Random Alive Images
const ALIVE_IMAGES = [
    "https://i.postimg.cc/dtfrgJRn/download-(6).jpg",
    "https://i.postimg.cc/nLkMjcGj/Chat-GPT-Image-Jul-31-2026-08-14-39-PM.png"
];

cmd({
    pattern: "alive",
    desc: "Check if the bot is active.",
    category: "main",
    react: "💗",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        // Random image on every command
        const ALIVE_IMG = ALIVE_IMAGES[Math.floor(Math.random() * ALIVE_IMAGES.length)];

        const pushname = m.pushName || "User";
        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("YYYY-MM-DD");

        const runtimeMilliseconds = Date.now() - botStartTime;
        const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
        const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
        const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

        const formattedInfo = `
╭┄┄┄┄[ *SANA-MD STATUS* ]┄┄┄┄
┊
┊     👋 ʜᴇʟʟᴏ: ${pushname}
┊
┊🕒 *වේලාව*: ${currentTime}
┊📅 *දිනය*: ${currentDate}
┊⏳ *ධාවන කාලය*: ${runtimeHours}h, ${runtimeMinutes}m, ${runtimeSeconds}s
╰───────────────

> 🤖 *Status*: *SANA-MD-MINI සක්‍රීයව පවතී! (Alive)*

🎉 *SANA MD භාවිත කර රසවිඳින්න!*
        `.trim();

        // Check if the image is defined
        if (!ALIVE_IMG || !ALIVE_IMG.startsWith("http")) {
            throw new Error("Invalid ALIVE_IMG URL. Please set a valid image URL.");
        }

        // Send the message with image and caption
        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363348739987203@newsletter',
                    newsletterName: 'ꜱᴀɴᴀ-ᴍ - ᴏꜰꜰɪᴄɪᴀʟ',
                    serverMessageId: 143
                }
            }
        }, { quoted: fakevCard });

    } catch (error) {
        console.error("Error in alive command: ", error);

        const errorMessage = `
❌ Alive command එක ක්‍රියාත්මක කිරීමේදී දෝෂයක් ඇති විය.
🛠 *Error Details*:
${error.message}
        `.trim();

        return reply(errorMessage);
    }
});

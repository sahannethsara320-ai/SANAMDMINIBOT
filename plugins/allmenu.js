const { cmd, commands } = require("../arslan");
const moment = require("moment-timezone");
const { fakevCard } = require('../lib/fakevCard');

// Random Menu Images
const MENU_IMAGES = [
    "https://i.postimg.cc/dtfrgJRn/download-(6).jpg",
    "https://i.postimg.cc/nLkMjcGj/Chat-GPT-Image-Jul-31-2026-08-14-39-PM.png"
];

cmd({
    pattern: "menu",
    alias: ["commandlist", "allmenu", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        // Random image on every menu command
        const MENU_IMG = MENU_IMAGES[Math.floor(Math.random() * MENU_IMAGES.length)];

        let totalCommands = 0;
        let grouped = {};

        // Group commands by category
        for (const cmd of commands) {
            if (!cmd.pattern || !cmd.category) continue;

            totalCommands++;
            if (!grouped[cmd.category]) grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd.pattern);
        }

        let menuText = "";
        for (const cat in grouped) {
            menuText += `\n🧚‍♀️ *${cat.toUpperCase()} COMMANDS*\n`;
            menuText += grouped[cat].map(c => `💫 .${c}`).join("\n") + "\n";
        }

        const time = moment().tz("Asia/Colombo").format("HH:mm:ss");
        const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");

        const caption = `
╭━━━《 *SANA-MD MINI* 》━━━┈⊷
┃ ✦╭─────────────┈⊷
┃ ✦│▸ මුළු Commands ගණන : *${totalCommands}*
┃ ✦│▸ වත්මන් වේලාව     : ${time}
┃ ✦│▸ වත්මන් දිනය       : ${date}
┃ ✦│▸ හිමිකරු (Owner)   : SANA MD
┃ ✦╰─────────────┈⊷
╰━━━━━━━━━━━━┈⊷
${menuText}
`.trim();

        await conn.sendMessage(m.chat, {
            image: { url: MENU_IMG },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363348739987203@newsletter",
                    newsletterName: "𝙎𝘼𝙉𝘼-𝙈𝘿 𝙈𝙞𝙣𝙞 𝙑²",
                    serverMessageId: 2,
                },
            },
        }, { quoted: fakevCard });

    } catch (err) {
        console.error("AllMenu Error:", err);
        reply("❌ මෙනුව සකස් කිරීමේදී දෝෂයක් ඇති විය.");
    }
});

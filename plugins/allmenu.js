const { cmd, commands } = require("../arslan");
const moment = require("moment-timezone");
const { fakevCard } = require('../lib/fakevCard');

// Random Menu Images
const MENU_IMAGES = [
    "https://i.postimg.cc/dtfrgJRn/download-(6).jpg",
    "https://i.postimg.cc/nLkMjcGj/Chat-GPT-Image-Jul-31-2026-08-14-39-PM.png",
    "https://i.postimg.cc/Pf978SP2/Chat-GPT-Image-Aug-2-2026-09-00-39-PM.png",
    "https://i.postimg.cc/bvcbxhpR/Chat-GPT-Image-Aug-2-2026-02-56-11-PM.png"
];

cmd({
    pattern: "menu",
    alias: ["commandlist", "allmenu", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    react: "📄",
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

        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 2,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363425704971310@newsletter',
                    newsletterName: 'SANA-MD - ᴏꜰꜰɪᴄɪᴀʟ',
                    serverMessageId: 143
                },
            },
        }, { quoted: fakevCard });

    } catch (err) {
        console.error("AllMenu Error:", err);
        reply("❌ මෙනුව සකස් කිරීමේදී දෝෂයක් ඇති විය.");
    }
});

const { cmd, commands } = require('../arslan');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "live"],
    desc: "Check Bot Status",
    category: "main",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {

        const totalCmds = commands.length;

        const uptime = () => {
            let sec = process.uptime();
            let h = Math.floor(sec / 3600);
            let m = Math.floor((sec % 3600) / 60);
            let s = Math.floor(sec % 60);
            return `${h}h ${m}m ${s}s`;
        };

        const status = `
╭━━〔 🤖 SANA MD MINI BOT 〕━━⬣
┃
┃ 👋 Hello @${sender.split("@")[0]}
┃
┃ 🟢 *Bot Status:* Online & Working
┃ 👑 *Owner:* SANA MD
┃ 🔐 *Mode:* ${config.MODE || "private"}
┃ ⚡ *Prefix:* ${config.PREFIX || "."}
┃ 🚀 *Version:* 1.0.0
┃ 📚 *Commands:* ${totalCmds}
┃ ⏳ *Uptime:* ${uptime()}
┃
╰━━━━━━━━━━━━━━━━⬣

💙 *Welcome to SANA MD MINI BOT*

✨ Thanks for using our bot.
⚡ Fast • Safe • Reliable
`;

        await conn.sendMessage(from, {
            text: status,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, {
            quoted: mek
        });

    } catch (e) {
        console.error("Alive Command Error:", e);
        reply("❌ Alive command එක run කරන්න බැරි වුණා. Please try again later.");
    }
});
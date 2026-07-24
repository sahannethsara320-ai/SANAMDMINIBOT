const { cmd } = require('../arslan');
const axios = require('axios');
const { fakevCard } = require('../lib/fakevCard');

const XV_API = "https://arslan-apis-v2.vercel.app";

const AXIOS_DEFAULTS = {
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
    }
};

// 🔁 Retry helper
async function tryRequest(fn, tries = 3) {
    let err;
    for (let i = 1; i <= tries; i++) {
        try {
            return await fn();
        } catch (e) {
            err = e;
            await new Promise(r => setTimeout(r, i * 1000));
        }
    }
    throw err;
}

// ❤️ React helper
async function react(sock, mek, emoji) {
    await sock.sendMessage(mek.key.remoteJid, {
        react: { text: emoji, key: mek.key }
    });
}

// 📦 Stylish info box - SANA MD Style
function xBox(data) {
    return `
‎*╔ஜ۩▒█ *ꜱᴀɴᴀ ᴍᴅ ᴍɪɴɪ ʙᴏᴛ* █▒۩ஜ╗*
*|* *_🔞 ᴀᴅᴜʟᴛ ᴠɪᴅᴇᴏ ꜱᴇᴀʀᴄʜ_* 
*|┉┉┉┉◉◉◉┉┉┉┉┉┉┉━•⟢*
*|▸ 📌 ᴛɪᴛʟᴇ:* ${data.title}
*|▸ ⏱ ᴅᴜʀᴀᴛɪᴏɴ:* ${data.duration || "N/A"}
*|▸ 👁️ ᴠɪᴇᴡꜱ:* ${data.views || "N/A"}
*|▸ 🥵 ᴏɴʟʏꜰᴀɴꜱ:* 🔞.... 
*|▸ 👤 ᴏᴡɴᴇʀ:* ꜱᴀɴᴀ ᴍᴅ
*╰━━━━━━━━━━━━━━━━━━⊷*`;
}

// 🔍 Search API
async function searchXvideos(query) {
    const api = `${XV_API}/download/xvideosSearch?text=${encodeURIComponent(query)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
    if (res.data?.status && res.data.result?.length)
        return res.data.result;
    throw new Error("Search failed");
}

// 🎬 Download API
async function downloadXvideo(url) {
    const api = `${XV_API}/download/xvideosDown?url=${encodeURIComponent(url)}`;
    const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
    if (res.data?.status && res.data.result?.url)
        return res.data.result;
    throw new Error("Download failed");
}

// ===============================
// 🔞 COMMAND: .xvideo <query|link>
// ===============================
cmd({
    pattern: "xxxvideo",
    alias: ["xxx", "porn", "sex", "sexyvideos", "pornhub", "xvideos", "sexy", "හුත්තෝ", "පොන්", "කැම්"],
    desc: "Search or download Xvideos | Xvideos හොයන්න හා ඩවුන්ලෝඩ් කරන්න",
    category: "adult",
    react: "🔞",
    filename: __filename
}, async (sock, mek, m, { reply }) => {

    try {
        const text = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
        const query = text.split(" ").slice(1).join(" ").trim();

        if (!query)
            return reply(`⚠️ *How to Use | භාවිතා කරන්නේ කෙසේද:*\n\n🔞 *.xxxvideo <video name>*\n📥 Example: *.xxxvideo japan*\n\n🔗 Or paste direct link | නැත්නම් Link එක Paste කරන්න:\n*.xxxvideo https://xvideos.com/...*`);

        await react(sock, mek, "🔍");

        let videoData;
        let videoUrl;

        // 🔗 Direct link
        if (query.startsWith("http")) {
            videoUrl = query;
            videoData = { title: "Xvideos Video", duration: "Unknown" };
        } 
        // 🔎 Search
        else {
            const results = await searchXvideos(query);
            videoData = results[0];
            videoUrl = videoData.url;
        }

        // 📦 Info box with SANA MD Logo
        await sock.sendMessage(m.chat, {
            image: { url: videoData.thumb || "https://i.postimg.cc/dtfrgJRn/download-(6).jpg" },
            caption: xBox(videoData)
        }, { quoted: fakevCard });

        await react(sock, mek, "⏳");

        // 🎬 Download
        const file = await downloadXvideo(videoUrl);

        await sock.sendMessage(m.chat, {
            video: { url: file.url },
            mimetype: "video/mp4",
            fileName: `${videoData.title}.mp4`,
            caption: `
‎*╔ஜ۩▒█ *ꜱᴀɴᴀ ᴍᴅ ᴍɪɴɪ ʙᴏᴛ* █▒۩ஜ╗*
‎*| 👑 ᴘᴏᴡᴇʀᴇᴅ ʙʏ *ꜱᴀɴᴀ ᴍᴅ* 
‎*| 🌐 ʙᴏᴛ: ꜱᴀɴᴀ ᴍᴅ ᴍɪɴɪ ʙᴏᴛ
‎*╰━━━━━━━━━━━━━━━━━━⊷*
‎
‎🔞 *Enjoy karanna boss!* 😈`
        }, { quoted: fakevCard });

        await react(sock, mek, "✅");

    } catch (e) {
        console.error(e);
        await react(sock, mek, "❌");
        reply(`❌ *Download Failed | ඩවුන්ලෝඩ් වැරදියි!*\n\n📞 Owner: SANA MD\n🔧`);
    }
});

const { fetchJson } = require('../lib/functions');
const { cmd } = require('../arslan');

cmd({
    pattern: "tiktok",  
    alias: ["tt", "ttdl", "tiktokdl"],
    react: '🎩',
    desc: "Download tiktok videos",
    category: "download",
    use: '.tiktok < tiktok url >',
    filename: __filename
},
async(conn, mek, m, {from, prefix, q, pushname, reply}) => {
    try {
        if (!q) return await reply('🔎 *Please provide a TikTok URL!*');
        if (!q.includes('tiktok')) return await reply('❌ *Invalid TikTok URL!*');

        const mov = await fetchJson(`https://darksadasyt-tiktokdl.vercel.app/api/tiktok?q=${q}`);

        let caption = `╭━━━〔 *SANA MD ᴠ02* 〕━━━┈⊷
┃ 🎩 *ᴛɪᴋᴛᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*
╰━━━━━━━━━━━━━━━┈⊷

*┌────────────────────┐*
*├ \`🎬 𝐓𝐢𝐭𝐥𝐞\` :* ${mov.title || 'Tiktok Video'}
*├ \`🌍 𝐑𝐞𝐠𝐢ො𝐧\` :* ${mov.regions || 'Unknown'}
*├ \`⏰ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧\` :* ${mov.runtime || 'Unknown'}
*├ \`📎 𝐔𝐑訊\` :* ${q}
*└────────────────────┘*

╭━━━〔 *ʀᴇᴘʟʏ ɴᴜᴍʙᴇʀ* 〕━━━┈⊷
┃ 1️⃣ | ᴠɪᴅᴇᴏ (ɴᴏ ᴡᴀᴛᴇʀᴍᴀʀᴋ) 📼
┃ 2️⃣ | ᴠɪᴅᴇᴏ (ᴡɪᴛʜ ᴡᴀᴛᴇʀᴍᴀʀᴋ) 🎥
┃ 3️⃣ | ᴀᴜᴅɪᴏ ᴏɴʟʏ 🎶
╰━━━━━━━━━━━━━━━┈⊷

_🔢 Please reply with the corresponding number._`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: mov.thumbnail },
            caption: caption
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": `ttdl1 ${mov.no_watermark}`,
            "2": `ttdl2 ${mov.watermark}`,
            "3": `ttdl3 ${mov.music}`
        };

    } catch (e) {
        console.log(e);
        reply(`*❌ Error downloading TikTok video!*\n\n${e.message || e}`);
    }
});

cmd({
    pattern: "ttdl1",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, {from, q, reply}) => {
    try {
        if (!q) return;
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });    
        
        await conn.sendMessage(
            from, 
            { video: { url: q }, mimetype: "video/mp4", caption: "© SANA MD V02" }, 
            { quoted: mek }
        );
        
        await conn.sendMessage(from, { react: { text: `✔️`, key: mek.key } });
    } catch (e) {
        console.log(e);
        reply(`*❌ Error !!*\n\n${e}`);
    }
});

cmd({
    pattern: "ttdl2",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, {from, q, reply}) => {
    try {
        if (!q) return;
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });    
        
        await conn.sendMessage(
            from, 
            { video: { url: q }, mimetype: "video/mp4", caption: "© SANA MD V02" }, 
            { quoted: mek }
        );
        
        await conn.sendMessage(from, { react: { text: `✔️`, key: mek.key } });
    } catch (e) {
        console.log(e);
        reply(`*❌ Error !!*\n\n${e}`);
    }
});

cmd({
    pattern: "ttdl3",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, {from, q, reply}) => {
    try {
        if (!q) return;
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        
        await conn.sendMessage(
            from, 
            { audio: { url: q }, mimetype: "audio/mpeg" }, 
            { quoted: mek }
        );
        
        await conn.sendMessage(from, { react: { text: `✔️`, key: mek.key } });
    } catch (e) {
        console.log(e);
        reply(`*❌ Error !!*\n\n${e}`);
    }
});

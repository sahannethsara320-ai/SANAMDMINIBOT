const axios = require("axios");
const { cmd } = require('../arslan');
const { fakevCard } = require('../lib/fakevCard');

cmd({
    pattern: "igdl",
    alias: ["instagram", "insta", "ig"],
    react: "⬇️",
    desc: "Download Instagram videos/reels",
    category: "downloader",
    use: ".igdl <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply("❌ *Please provide or reply to a valid Instagram link!*\n\n> කරුණාකර නිවැරදි Instagram ලින්ක් එකක් ඇතුළත් කරන්න.");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Fetch from API
        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data.data?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Failed to fetch media!*\n\n> වීඩියෝව ලබා ගැනීමට නොහැකි විය. ලින්ක් එක පෞද්ගලික (Private) ගිණුමක එකක් විය හැක.");
        }

        // Send all media items
        for (const item of response.data.data) {
            await conn.sendMessage(from, {
                [item.type === 'video' ? 'video' : 'image']: { url: item.url },
                caption: `‎*✨ SANA MD MINI BOT INSTAGRAM DOWNLOADER ✨*

‎╔ஜ۩▒█ *ꜱᴀɴᴀ ᴍᴅ ᴍɪɴɪ* █▒۩ஜ╗
‎*|* ᴘᴏᴡᴇʀᴇᴅ ʙʏ *ꜱᴀɴᴀ ᴍᴅ* 
‎*╰━━━━━━━━━━━━━━━━━━⊷*`
            }, { quoted: fakevCard });
        }

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('IGDL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ *Download failed!* Please try again later.\n\n> බාගත කිරීම අසාර්ථකයි. පසුව නැවත උත්සාහ කරන්න.");
    }
});

cmd({
  pattern: "igdl4",
  alias: ["instagram4", "insta4", "ig4", "igvideo4"],
  react: '📶',
  desc: "Download videos from Instagram (Alternative API)",
  category: "download",
  use: ".igdl4 <Instagram URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('❌ *Please provide a valid Instagram URL!*\n\n> Example: `.igdl4 https://instagram.com/...`');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://bk9.fun/download/instagram?url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.status || !response.data?.BK9?.[0]?.url) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ *Unable to fetch the video!*\n\n> වීඩියෝව ලබා ගැනීමට නොහැකි විය. කරුණාකර වෙනත් ක්‍රමයක් උත්සාහ කරන්න.');
    }

    const videoUrl = response.data.BK9[0].url;
    await conn.sendMessage(from, { react: { text: '📶', key: m.key } });

    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ *Failed to download the video!* Please try again later.');
    }

    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: `*✨ SANA MD MINI BOT INSTAGRAM DOWNLOADER ✨*

‎╔ஜ۩▒█ *...ꜱᴀɴᴀ ᴍᴅ ᴍɪɴɪ...* █▒۩ஜ╗
‎*|* ᴘᴏᴡᴇʀᴇᴅ ʙʏ *...ꜱᴀɴᴀ ᴍᴅ...* 
‎*╰━━━━━━━━━━━━━━━━━━⊷*`
    }, { quoted: fakevCard });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading video:', error);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply('❌ *API failed!* Try another download option.\n\n> ක්‍රියාවලිය අසාර්ථකයි. වෙනත් ක්‍රමයක් උත්සාහ කරන්න.');
  }
});

cmd({
  pattern: "igdl2",
  alias: ["instagram2", "ig2", "instadl2"],
  react: '📥',
  desc: "Download videos from Instagram (API v5)",
  category: "download",
  use: ".igdl2 <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('❌ *Please provide a valid Instagram video URL!*\n\n> Example:\n.igdl2 https://instagram.com/reel/...');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    const data = response.data;

    if (!data.status || !data.result || !Array.isArray(data.result)) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ *Unable to fetch the video!* Please check the URL and try again.');
    }

    const videoUrl = data.result[0];
    if (!videoUrl) {
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        return reply("❌ *No video found in the response!*");
    }

    const metadata = data.metadata || {};
    const author = metadata.author || "Unknown User";
    const captionText = metadata.caption ? metadata.caption.slice(0, 200) + "..." : "No caption provided.";
    const likes = metadata.like || 0;
    const comments = metadata.comment || 0;

    await reply('⏳ *Uploading your video, please wait...*\n\n> වීඩියෝව Upload වෙමින් පවතී, සුළු මොහොතක් රැඳී සිටින්න...');

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `📥 *Instagram Reel Downloader*\n\n👤 *Author:* ${author}\n💬 *Caption:* ${captionText}\n❤️ *Likes:* ${likes} | 💭 *Comments:* ${comments}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ☬༒ꜱᴀɴᴀ-ᴍᴅ-ᴍɪɴɪ༒☬`
    }, { quoted: fakevCard });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('IGDL2 Error:', error);
    reply('❌ *Failed to download the Instagram video!* Please try again later.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

cmd({
    pattern: "ig3",
    alias: ["insta3", "instagram3"],
    desc: "Download Instagram video",
    category: "downloader",
    react: "⤵️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide an Instagram video link!*\n\n> කරුණාකර Instagram ලින්ක් එකක් ඇතුළත් කරන්න.");
        if (!q.includes("instagram.com")) return reply("❌ *Invalid Instagram link!*");
        
        reply("⏳ *Downloading video, please wait...*\n\n> වීඩියෝව බාගත වෙමින් පවතී, රැඳී සිටින්න...");
        
        const apiUrl = `https://rest-lily.vercel.app/api/downloader/igdl?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data || !data.data[0]) return reply("❌ *Failed to fetch Instagram video!*");
        
        const { url } = data.data[0];
        
        const caption = 
`*✨ SANA MD MINI BOT INSTAGRAM DOWNLOADER ✨*

‎╔ஜ۩▒█ *ꜱᴀɴᴀ ᴍᴅ ᴍɪɴɪ* █▒۩ஜ╗
‎*|* ᴘᴏᴡᴇʀᴇᴅ ʙʏ *...ꜱᴀɴᴀ ᴍᴅ...* 
‎*╰━━━━━━━━━━━━━━━━━━⊷*`;
        
        await conn.sendMessage(from, {
            video: { url: url },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fakevCard });
        
    } catch (e) {
        console.error("Error in Instagram downloader command:", e);
        reply(`❌ *An error occurred:* ${e.message}`);
    }
});

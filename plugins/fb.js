const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "fb",
  react: "📥",
  alias: ["facebook", "fbdl"],
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("⚠️ *SANA MD MINI BOT - FB DOWNLOADER* ⚠️\n\n❓ *Please provide a Facebook video link!*\n(කරුණාකර ඔබට Download කර ගැනීමට අවශ්‍ය Facebook Video Link එක ලබා දෙන්න.)\n\n*Format (භාවිතා කරන ක්‍රමය):*\n• .fb <Facebook Video Link>");

    // Send a loading message or react
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://movanest.xyz/v2/fbdown?url=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    // API status check
    if (data.status !== true) {
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        return reply("❌ *API Error! Could not process the request.*\n(වීඩියෝව ලබා ගැනීමට නොහැකි විය. පසුව උත්සාහ කරන්න.)");
    }

    // Results check
    if (!Array.isArray(data.results) || data.results.length === 0) {
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        return reply("❌ *Facebook video not found!*\n(වලංගු Facebook වීඩියෝවක් සොයාගත නොහැකි විය. Link එක පරීක්ෂා කරන්න.)");
    }

    const result = data.results[0];

    // Quality selection (HD preferred, fallback to normal)
    const videoUrl = result.hdQualityLink
      ? result.hdQualityLink
      : result.normalQualityLink;

    if (!videoUrl) {
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        return reply("❌ *Could not extract video URL. Please provide a direct video link!*");
    }

    // Caption formatted for SANA MD MINI BOT
    const caption = `✨ *SANA MD MINI BOT - FB DOWNLOADER* ✨\n\n` +
                    `⏱️ *Duration:* ${result.duration || 'Unknown'}\n` +
                    `👑 *Owner:* SANA MD 🍁\n\n` +
                    `*Enjoy your video!* ❤️`;

    await conn.sendMessage(
      from,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: caption
      },
      { quoted: mek }
    );

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.log(err);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("❌ *An error occurred while downloading the video.*");
  }
});

const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "apk",
  alias: ["app", "playstore", "application"],
  react: "📥",
  desc: "Download APK via Aptoide",
  category: "download",
  use: ".apk <name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) {
        return reply(
            "⚠️ *SANA MD MINI BOT - APK DOWNLOADER* ⚠️\n\n" +
            "❓ *Please provide an application or game name!*\n" +
            "(කරුණාකර ඔබට ඩවුන්ලෝඩ් කර ගැනීමට අවශ්‍ය ඇප් එකේ හෝ ගේම් එකේ නම ලබා දෙන්න.)\n\n" +
            "*Format (භාවිතා කරන ක්‍රමය):*\n• .apk WhatsApp"
        );
    }

    // Send a loading message or react
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `http://aptoide.com{encodeURIComponent(q)}/limit=1`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.datalist || !data.datalist.list.length) {
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        return reply("❌ *APK not found! Please check the app name and try again.*\n(එවැනි ඇප් එකක් සොයාගත නොහැකි විය. නම නිවැරදිව ටයිප් කරන්න.)");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2);

    let caption = `*╭━━━〔 👑 SANA MD MINI BOT 👑 〕━━━┈⊷*\n` +
                  `*┃ 🔹 NAME:* ${app.name.toUpperCase()}\n` +
                  `*┃ 🔹 SIZE :❯* ${appSize} MB\n` +
                  `*┃ 🔹 PACK :❯* ${app.package.toUpperCase()}\n` +
                  `*┃ 🔹 VER :❯* ${app.file.vername}\n` +
                  `*╰━━━━━━━━━━━━━━━┈⊷*\n\n` +
                  `*👑 OWNER :❯ SANA MD 🍁*\n` +
                  `*⏳ Uploading your APK file, please wait...*`;

    // Send App Info and Icon
    await conn.sendMessage(from, { image: { url: app.icon }, caption }, { quoted: mek });

    // Send the actual APK Document
    await conn.sendMessage(from, {
      document: { url: app.file.path || app.file.path_alt },
      mimetype: "application/vnd.android.package-archive",
      fileName: `${app.name.toUpperCase()}.apk`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error("APK Download Error:", err);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("❌ *An error occurred while downloading the APK.*");
  }
});

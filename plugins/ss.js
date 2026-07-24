const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "screenshot",
  alias: ["ss", "webshot", "sitepic"],
  react: "🖥️",
  category: "tools",
  desc: "Take full HD desktop screenshot of a website",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply(
        "*🖥️ වෙබ් අඩවි SCREENSHOT ලබාගැනීමේ COMMAND එක*\n\n" +
        "*භාවිතය:*\n" +
        "*.screenshot <වෙබ් අඩවියේ ලින්ක් එක>*\n\n" +
        "*උදාහරණයක්:*\n" +
        "*.screenshot https://google.com*"
      );
    }

    // ✅ API call to movanest.xyz for full HD screenshot (1280x720)
    const apiUrl = `https:///movanest.xyz/v2/ssweb?url=${encodeURIComponent(q)}&width=1280&height=720&full_page=true`;
    const res = await axios.get(apiUrl, { timeout: 60000 });

    if (!res.data || !res.data.status || !res.data.screenshot) {
      return reply("❌ කණගාටුයි, Screenshot එක ලබාගැනීමට නොහැකි විය. (API සර්වර් දෝෂයකි)");
    }

    const screenshotUrl = res.data.screenshot;

    // ✅ Send screenshot
    await conn.sendMessage(from, {
      image: { url: screenshotUrl },
      caption: `🖥️ Screenshot of: ${q}\n\n> © SANA MD TOOLS`
    }, { quoted: mek });

  } catch (err) {
    console.error("SCREENSHOT COMMAND ERROR:", err.message);
    reply("❌ Screenshot එක ලබාගැනීමට නොහැකි විය. සර්වර් එක කාර්යබහුලයි.");
  }
});

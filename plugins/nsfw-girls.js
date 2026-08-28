const { cmd } = require("../arslan");
const { fakevCard } = require('../lib/fakevCard');

cmd({
  pattern: "boobs",
  alias: ["xboobs", "bobs"],
  desc: "NSFW Image Generator",
  category: "adult",
  react: "🔞",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const apiUrl = "https://api.azbry.com/api/ai/imagegen?prompt=Nude+Fuck+Real+Girl";

    await conn.sendMessage(from, {
      image: { url: apiUrl },
      caption: "🔞 *NSFW Image*\n\n© SANA MD"
    }, {
      quoted: fakevCard
    });

  } catch (err) {
    console.log(err);
    reply("❌ Image එක ලබාදෙන්න බැරි වුණා. Please try again later.");
  }
});

cmd({
  pattern: "xgirl",
  alias: ["xgirls", "ximg"],
  desc: "NSFW Image Generator",
  category: "adult",
  react: "🔞",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const apiUrl = "https://api.azbry.com/api/ai/imagegen?prompt=Nude+Fuck+Real+Girl";

    await conn.sendMessage(from, {
      image: { url: apiUrl },
      caption: "🔞 *NSFW Image*\n\n© SANA MD"
    }, {
      quoted: fakevCard
    });

  } catch (err) {
    console.log(err);
    reply("❌ Image එක ලබාදෙන්න බැරි වුණා. Please try again later.");
  }
});

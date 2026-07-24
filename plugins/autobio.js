const { cmd } = require('../arslan');
const config = require('../config');

cmd({
  pattern: "autobio",
  alias: ["bioauto", "setautobio"],
  react: "😎",
  category: "owner",
  desc: "Auto bio on/off",
  filename: __filename
}, async (conn, mek, m, { from, q, reply, isOwner }) => {
  try {

    // 🔐 Owner only
    if (!isOwner) {
      return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command is only for my owner (SANA MD)!*\n(මෙය භාවිතා කිරීමට බොට් අයිතිකරුට පමණක් අවසර ඇත.)");
    }

    const state = q?.toLowerCase();

    // ❓ Help / status
    if (!state || !["on", "off"].includes(state)) {
      return reply(
        `✨ *SANA MD MINI BOT - AUTO BIO* ✨\n\n` +
        `*Usage (භාවිතා කරන ක්‍රමය):*\n` +
        `➤ *.autobio on* (Bio එක සක්‍රීය කිරීමට)\n` +
        `➤ *.autobio off* (Bio එක අක්‍රීය කිරීමට)\n\n` +
        `📌 *Current Status:* ${global.autoBio ? "ON ✅" : "OFF ❌"}`
      );
    }

    // ✅ Set state
    global.autoBio = state === "on";

    if (global.autoBio) {
      updateBio(conn);
    }

    return reply(`✨ *SANA MD MINI BOT* ✨\n\n⚙️ *Auto Bio status has been updated to ${state.toUpperCase()}!*`);

  } catch (e) {
    console.log("AUTOBIO ERROR:", e);
    reply("❌ *An error occurred while configuration.*");
  }
});


// ================= BIO UPDATER =================
async function updateBio(conn) {
  if (!global.autoBio) return;

  try {
    const uptime = clockString(process.uptime() * 1000);
    const botname = "SANA MD MINI BOT"; // Set to your Bot Name

    const bio = `👑 ${botname} ACTIVE ⏳ UPTIME: [${uptime}] 👑`;
    await conn.updateProfileStatus(bio);

    console.log("✅ BIO UPDATED:", bio);
  } catch (err) {
    console.log("❌ BIO UPDATE FAILED:", err.message);
  }

  // ⏱️ 1 minute loop
  setTimeout(() => updateBio(conn), 60 * 1000);
}


// ================= TIME FORMAT =================
function clockString(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;

  let str = "";
  if (d) str += `${d}d `;
  if (h) str += `${h}h `;
  if (m) str += `${m}m `;
  if (s) str += `${s}s`;
  return str.trim();
}

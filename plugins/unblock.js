const { cmd } = require('../arslan');

cmd({
  pattern: "unblock",
  alias: ["unb", "unblk", "unblok"],
  react: "🥰",
  category: "owner",
  desc: "Unblock user (reply or inbox)",
  filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
  try {

    // 🔒 Owner only
    if (!isOwner) {
      return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");
    }

    let jid;

    // 📌 Reply case
    if (m.quoted) {
      jid = m.quoted.sender;
    }
    // 📌 Inbox case
    else if (from.endsWith("@s.whatsapp.net")) {
      jid = from;
    } 
    else {
      return reply("*🥰 අන්බ්ලොක් කිරීමට අවශ්‍ය පුද්ගලයාගේ පණිවිඩයකට Reply කරන්න, නැතහොත් ඔහුගේ Inbox එක තුළ මෙම Command එක ටයිප් කරන්න.*");
    }

    await conn.updateBlockStatus(jid, "unblock");

    await conn.sendMessage(from, {
      react: { text: "🥰", key: mek.key }
    });

    reply(`*සාර්ථකයි! මම ඔබව Unblock කරන ලදී ☺️*`, { mentions: [jid] });

  } catch (e) {
    console.log("UNBLOCK ERROR:", e);
    reply("*❌ Unblock කිරීමට නොහැකි විය. දෝෂයක් පවතී 😔*");
  }
});

const { cmd } = require('../arslan')

cmd({
    pattern: "vv",
    alias: ["viewonce", "view", "open"],
    react: "🔓",
    desc: "Retrieve view-once media (Owner only)",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator)
            return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*")

        if (!m.quoted)
            return reply(
                "*🥺 කරුණාකර View Once පින්තූරයකට, වීඩියෝවකට හෝ ඕඩියෝවකට Reply කරන්න.*\n\n" +
                "*ඊටපස්සේ ටයිප් කරන්න:* `.vv`\n\n" +
                "*එතකොට බොට් ඒක normal media එකක් විදිහට එවයි! 😎*"
            )

        // 🔥 VIEW ONCE FIX
        let quoted = m.quoted
        let msg = quoted.message

        if (msg?.viewOnceMessageV2) {
            msg = msg.viewOnceMessageV2.message
        } else if (msg?.viewOnceMessageV2Extension) {
            msg = msg.viewOnceMessageV2Extension.message
        }

        const type = Object.keys(msg)[0]
        const buffer = await quoted.download()

        let content = {}

        if (type === "imageMessage") {
            content = {
                image: buffer,
                caption: (quoted.text || "") + "\n\n*🔓 Opened by SANA MD*"
            }
        } 
        else if (type === "videoMessage") {
            content = {
                video: buffer,
                caption: (quoted.text || "") + "\n\n*🔓 Opened by SANA MD*"
            }
        } 
        else if (type === "audioMessage") {
            content = {
                audio: buffer,
                mimetype: "audio/mp4",
                ptt: false
            }
        } 
        else {
            return reply("*❌ කණගාටුයි, මෙම View Once වර්ගයට බොට් සපෝට් කරන්නේ නැත! 🥺*")
        }

        await conn.sendMessage(from, content, { quoted: mek })

    } catch (e) {
        console.log("VV ERROR:", e)
        reply("*❌ View Once ඕපන් කිරීමේදී දෝෂයක් ඇති විය 🥺*")
    }
})

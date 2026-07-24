const { cmd } = require('../arslan')
const { fetchGif, gifToSticker } = require('../lib/sticker-utils')

cmd({
    pattern: "attp",
    alias: ["attptext", "textsticker", "namesticker", "stickername", "at", "att", "atp"],
    react: "✨",
    desc: "Convert text into animated sticker",
    category: "sticker",
    use: ".attp <text>",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply(
                "⚠️ *SANA MD MINI BOT - TEXT STICKER* ⚠️\n\n" +
                "❓ *Please provide a name or text to create a sticker!*\n" +
                "(ඔබේ නමින් ස්ටිකරයක් හැදීමට අවශ්‍ය වචනය ඇතුළත් කරන්න!)\n\n" +
                "*Format (භාවිතා කරන ක්‍රමය):*\n• .attp SANA MD"
            )
        }

        // Send a temporary loading reply
        reply("✨ *SANA MD MINI BOT* ✨\n\n⏳ *Your text sticker is creating... Please wait!*\n(ඔබේ ස්ටිකරය සකස් වෙමින් පවතී, සුළු මොහොතක් රැඳී සිටින්න...)")

        const text = encodeURIComponent(args.join(" "))
        const gifBuffer = await fetchGif(
            `https://api-fix.onrender.com/api/maker/attp?text=${text}`
        )

        const sticker = await gifToSticker(gifBuffer)

        await conn.sendMessage(
            m.chat,
            { sticker },
            { quoted: mek }
        )

    } catch (e) {
        console.log("ATTP ERROR:", e)
        reply("❌ *Failed to create text sticker. Error occurred!*\n(ස්ටිකරය සෑදීම අසාර්ථක විය.)");
    }
})

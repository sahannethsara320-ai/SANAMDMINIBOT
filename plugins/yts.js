const { cmd } = require('../arslan')
const yts = require('yt-search')

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    react: "🔍",
    desc: "Search videos on YouTube",
    category: "search",
    use: ".yts <video name>",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(
                "*🔍 ඔබට යූටියුබ් වීඩියෝ සර්ච් කිරීමට අවශ්‍යද? 🥺*\n\n" +
                "*භාවිතය:*\n.yts වීඩියෝවේ නම\n\n" +
                "*උදාහරණයක්:*\n.yts Sidhalepa Song"
            )
        }

        const search = await yts(q)
        const videos = search.videos.slice(0, 10) // top 10 results

        if (videos.length === 0) {
            return reply("*❌ කණගාටුයි, එවැනි වීඩියෝවක් සොයාගත නොහැකි විය 🥺*")
        }

        let text = "*📺 YOUTUBE SEARCH RESULTS 📺*\n\n"

        for (let i = 0; i < videos.length; i++) {
            const v = videos[i]
            text +=
`*${i + 1}. ${v.title}*
⏱️ ධාවන කාලය: ${v.timestamp}
👁️ නරඹන්නන්: ${v.views} views
🔗 ලින්ක් එක: ${v.url}

`
        }

        text += "*👑 SANA-MD WHATSAPP BOT 👑*"

        await conn.sendMessage(
            from,
            { text },
            { quoted: mek }
        )

    } catch (e) {
        console.log("YTS ERROR:", e)
        reply("*❌ යූටියුබ් සර්ච් කිරීමේදී දෝෂයක් ඇති විය 🥺*")
    }
})

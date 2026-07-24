const axios = require('axios')
const yts = require('yt-search')
const { cmd } = require('../arslan')
const { fakevCard } = require('../lib/fakevCard')

cmd({
pattern: "video",
alias: ["vid","playvideo"],
desc: "Download YouTube Video (Fast)",
category: "download",
react: "🎬",
filename: __filename
},
async (conn, mek, m, { from, reply, text }) => {

try {

if (!text) {
return reply("❌ කරුණාකර වීඩියෝවේ නම ලබාදෙන්න:\nඋදාහරණ: .video pasoori")
}

/* 🔍 Search */
const search = await yts(text)

if (!search.videos.length) {
return reply("❌ කණගාටුයි, එවැනි වීඩියෝවක් සොයාගත නොහැකි විය.")
}

const vid = search.videos[0]

/* 🎨 Preview */

const caption = `
╔ஜ۩▒█ SANA X MD █▒۩ஜ╗
┃🎬 VIDEO FOUND!
┃📌 Title: ${vid.title}
┃⏱️ Duration: ${vid.timestamp}
┃⚡ ඩවුන්ලෝඩ් වෙමින් පවතී, රැඳී සිටින්න...
╰━━━━━━━━━━━━━━⊷
`

await conn.sendMessage(from,{
image:{url:vid.thumbnail},
caption
},{quoted:fakevCard})

/* 🎥 API */

const api = `https://arslan-apis-v2.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`

const res = await axios.get(api,{timeout:60000})

if(
!res.data ||
!res.data.status ||
!res.data.result ||
!res.data.result.download ||
!res.data.result.download.url
){
return reply("❌ වීඩියෝ ඩවුන්ලෝඩර් සර්වර් එකේ දෝෂයක් පවතී.")
}

const videoUrl = res.data.result.download.url
const title = res.data.result.metadata.title || vid.title

/* 🚀 SEND VIDEO DIRECT */

await conn.sendMessage(from,{
video:{url:videoUrl},
mimetype:"video/mp4",
caption:`🎬 *${title}*\n\n> © SANA-MD WHATSAPP BOT`
},{quoted:fakevCard})

}catch(err){

console.log(err)
reply("❌ වීඩියෝව ලබාගැනීමේදී දෝෂයක් ඇති විය.")

}

})

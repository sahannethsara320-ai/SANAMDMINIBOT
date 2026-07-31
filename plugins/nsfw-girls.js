const { cmd } = require("../arslan");

// Simple fake vCard without external file
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© SANA MD",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SANA MD\nORG:SANA MD;\nTEL;type=CELL;waid=94770740571:+94 77 074 0571\nEND:VCARD"
        }
    }
};

cmd({
    pattern: "boobs",
    alias: ["xboobs", "bobs"],
    desc: "Random Anime Girl Image",
    category: "fun",
    react: "🌸",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = "https://api.waifu.pics/nsfw/waifu";

        await conn.sendMessage(from, {
            image: { url: apiUrl },
            caption: "🌸 *Random Anime Girl*\n\n© SANA MD"
        }, {
            quoted: fakevCard
        });

    } catch (err) {
        console.log("Boobs error:", err);
        reply("❌ Failed to load image. Try again later.");
    }
});

cmd({
    pattern: "xgirl",
    alias: ["xgirls", "ximg"],
    desc: "Random Anime Girl Image",
    category: "fun",
    react: "🌸",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = "https://api.waifu.pics/nsfw/neko";

        await conn.sendMessage(from, {
            image: { url: apiUrl },
            caption: "🌸 *Random Anime Girl*\n\n© SANA MD"
        }, {
            quoted: fakevCard
        });

    } catch (err) {
        console.log("Xgirl error:", err);
        reply("❌ Failed to load image. Try again later.");
    }
});

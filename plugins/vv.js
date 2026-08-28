const fs = require('fs');
const path = require('path');
const { cmd } = require('../arslan');

const dbPath = path.join(__dirname, 'vv_trigger.json');

// Reusable helper to download and send the View Once media using quoted.download()
async function downloadAndForwardVV(conn, mek, m, from, reply) {
    let quoted = m.quoted;
    let msg = quoted.message;

    // Extract inside viewOnce containers
    if (msg?.viewOnceMessageV2) {
        msg = msg.viewOnceMessageV2.message;
    } else if (msg?.viewOnceMessageV2Extension) {
        msg = msg.viewOnceMessageV2Extension.message;
    } else if (msg?.viewOnceMessage) {
        msg = msg.viewOnceMessage.message;
    }

    const type = Object.keys(msg)[0];
    const buffer = await quoted.download();

    let content = {};
    const captionText = (quoted.text || "") + "\n\n*🔓 Opened by SANA MD*";

    if (type === "imageMessage") {
        content = { image: buffer, caption: captionText };
    } 
    else if (type === "videoMessage") {
        content = { video: buffer, caption: captionText };
    } 
    else if (type === "audioMessage") {
        content = { audio: buffer, mimetype: "audio/mp4", ptt: false };
    } 
    else {
        return reply("*❌ කණගාටුයි, මෙම View Once වර්ගයට බොට් සපෝට් කරන්නේ නැත! 🥺*");
    }

    // Send back to the chat or owner privately
    await conn.sendMessage(from, content, { quoted: mek });
}

// 1. Trigger Configuration Command (.setvv)
cmd({
    pattern: "setvv",
    react: "⚙️",
    desc: "Set a custom prefix-less trigger for VV",
    category: "owner",
    use: '.setvv <emoji or word>',
    filename: __filename
},
async (conn, mek, m, { q, isCreator, reply }) => {
    if (!isCreator) return await reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");

    const query = q ? q.trim() : "";

    if (query.toLowerCase() === 'reset') {
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
        return await reply("✅ *Custom VV Trigger Reset!*\n\nදැන් default emoji එක 🔓 භාවිතා වේ / Now using default emoji: 🔓");
    }

    if (!query) {
        return await reply(`🛠️ *CUSTOM VV TRIGGER SETUP* 🛠️\n\n*🔹 Custom emoji හෝ word එකක් set කරන්න (Prefix අවශ්‍ය නැහැ):*\n.setvv 🔓\n.setvv get\n\n*🔹 Default එකට reset කරන්න:*\n.setvv reset`);
    }

    fs.writeFileSync(dbPath, JSON.stringify({ trigger: query }));
    await reply(`✅ *CUSTOM VV TRIGGER SAVED!*\n\nදැන් View Once message එකකට reply කරලා මේක පමණක් යවන්න:\n*${query}*\n_(Dot හෝ prefix අවශ්‍ය නැහැ!)_`);
});

// 2. Prefix-less Trigger Logic (Auto Detection)
cmd({
    on: "body" 
},
async (conn, mek, m, { from, body, isCreator, reply }) => {
    try {
        if (!isCreator || !m.quoted) return;

        const msgText = (body || mek.message?.conversation || mek.message?.extendedTextMessage?.text || "").trim();
        if (!msgText) return;

        let trigger = "🔓"; 
        if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath));
            trigger = data.trigger;
        }

        if (msgText !== trigger) return;

        await downloadAndForwardVV(conn, mek, m, from, reply);
    } catch (e) {
        console.log("VV_PREFIXLESS_ERROR:", e);
    }
});

// 3. Main Command Logic (.vv)
cmd({
    pattern: "vv",
    alias: ["viewonce", "view", "open"],
    desc: "Retrieve view-once media (Owner only)",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator)
            return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) පමණි!*");

        if (!m.quoted)
            return reply(
                "*🥺 කරුණාකර View Once පින්තූරයකට, වීඩියෝවකට හෝ ඕඩියෝවකට Reply කරන්න.*\n\n" +
                "*ඊටපස්සේ ටයිප් කරන්න:* `.vv`\n\n" +
                "*එතකොට බොට් ඒක normal media එකක් විදිහට එවයි! 😎*"
            );

        await downloadAndForwardVV(conn, mek, m, from, reply);

    } catch (e) {
        console.log("VV ERROR:", e);
        reply("*❌ View Once ඕපන් කිරීමේදී දෝෂයක් ඇති විය 🥺*");
    }
});

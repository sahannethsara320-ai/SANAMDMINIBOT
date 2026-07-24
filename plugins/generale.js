const { cmd, commands } = require('../arslan');
const config = require('../config');
const os = require('os');

// =================================================================
// 🏓 COMMANDE PING (Style Speedtest)
// =================================================================
cmd({
    pattern: "uptime",
    alias: ["speed", "ping"],
    desc: "Vérifier la latence et les ressources",
    category: "general",
    react: "👑"
},
async(conn, mek, m, { from, reply, myquoted }) => {
    try {
        const start = Date.now();
        
        // 1. Message d'attente
        const msg = await conn.sendMessage(from, { text: '⚡ *SANA MD MINI BOT IS TESTING SPEED...*\n\n> වේගය පරීක්ෂා කරමින් පවතී, සුළු මොහොතක් රැඳී සිටින්න...' }, { quoted: myquoted });
        
        const end = Date.now();
        const latency = end - start;
        
        // 2. Calcul Mémoire (RAM)
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const usedMem = (totalMem - freeMem).toFixed(0);

        // 3. Message Final Stylé
        const pingMsg = `*🔮 SANA MD MINI BOT SPEEDTEST 🔮*

⚡ *LATENCY / PING :* \`${latency} ms\`
📟 *RAM USAGE :* \`${usedMem} MB / ${totalMem} MB\`

> *Powered by SANA MD*`;

        // 4. Édition du message (Effet visuel)
        await conn.sendMessage(from, { text: pingMsg, edit: msg.key });

    } catch (e) {
        reply("❌ *Error:* " + e.message);
    }
});


// =================================================================
// 👑 COMMANDE OWNER (Carte de visite)
// =================================================================
cmd({
    pattern: "owner",
    alias: ["creator", "developer"],
    desc: "Contacter le créateur",
    category: "general",
    react: "👑"
},
async(conn, mek, m, { from, myquoted }) => {
    try {
        // ඔබේ ස්ථිර දුරකථන අංකය කෙලින්ම vCard එකට ඇතුළත් කර ඇත
        const ownerNumber = "94770740571"; 
        
        // Création d'une vCard (Fiche contact)
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      'FN:SANA MD (Owner)\n' +
                      'ORG:SANA MD MINI BOT;\n' +
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n` +
                      'END:VCARD';

        // Contact කාඩ්පත යැවීමට පෙර කෙටි පණිවිඩයක්
        await conn.sendMessage(from, { text: "👑 *SANA MD MINI BOT OWNER DETAILS* 👑\n\n> මෙන්න බොට් අයිතිකරුගේ සම්බන්ධතා තොරතුරු (Contact Card)..." }, { quoted: myquoted });

        await conn.sendMessage(from, {
            contacts: {
                displayName: 'SANA MD',
                contacts: [{ vcard }]
            }
        }, { quoted: myquoted });

    } catch (e) {
        console.error("Owner command error:", e);
    }
});

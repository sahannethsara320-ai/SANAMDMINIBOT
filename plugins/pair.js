// ═══════════════════════════════════════════════════════════════════════════
//  📱 PAIR CODE COMMAND - SANA MD MINI BOT
// ═══════════════════════════════════════════════════════════════════════════

const { cmd } = require('../arslan');
const axios = require('axios');

// ═══════════════════════════════════════════════════════════════════════
//  🔗 PAIR COMMAND - Get pairing code via message
// ═══════════════════════════════════════════════════════════════════════

cmd({
    pattern: "pair",
    alias: ["getpair", "pairing", "code"],
    react: "🔐",
    desc: "Get WhatsApp pairing code",
    category: "main",
    use: ".pair 947XXXXXXXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Extract phone number
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate
        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(`❌ *Invalid Number*\n\nPlease provide your WhatsApp number with country code.\n*Example:* \`${command} 94770740571\``);
        }

        // Show processing
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Get pairing code from your server
        const apiUrl = `http://localhost:8000/code?number=${encodeURIComponent(phoneNumber)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });

        if (!response.data || !response.data.code) {
            return await reply("❌ *Failed to generate pairing code.*\n\nPlease try again later.");
        }

        const pairingCode = response.data.code;

        // Send success message with code
        await conn.sendMessage(from, {
            image: { url: "https://i.postimg.cc/dtfrgJRn/download-(6).jpg" },
            caption: `✅ *Pairing Code Generated*\n\n🔢 *Code:* \`${pairingCode}\`\n\n📱 *Instructions:*\n1. Open WhatsApp on your phone\n2. Go to Settings → Linked Devices\n3. Tap "Link a Device"\n4. Enter the code above\n\n⏰ *Note:* Code expires in 2 minutes`
        }, { quoted: mek });

        // Send clean code separately for easy copying
        await reply(`\`${pairingCode}\``);

        // Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error.message);
        await reply("❌ *Error:* " + (error.message || "Failed to get pairing code"));
    }
});

// ═══════════════════════════════════════════════════════════════════════
//  🔗 PAIR2 COMMAND - With more details
// ═══════════════════════════════════════════════════════════════════════

cmd({
    pattern: "pair2",
    alias: ["getpair2", "linkdevice"],
    react: "📱",
    desc: "Get pairing code with detailed instructions",
    category: "main",
    use: ".pair2 947XXXXXXXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Only work in private chat
        if (isGroup) {
            return await reply("❌ This command only works in private chat.\n\nPlease message me directly.");
        }

        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(`❌ *Invalid Number*\n\nPlease provide your WhatsApp number.\n*Example:* \`${command} 94770740571\``);
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const apiUrl = `http://localhost:8000/code?number=${encodeURIComponent(phoneNumber)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });

        if (!response.data || !response.data.code) {
            return await reply("❌ *Failed to generate code.*\n\nServer might be busy. Please try again.");
        }

        const pairingCode = response.data.code;

        // Detailed message
        await conn.sendMessage(from, {
            image: { url: "https://i.postimg.cc/dtfrgJRn/download-(6).jpg" },
            caption: `🔐 *SANA MD MINI BOT - Pairing*\n\n✅ Code generated successfully!\n\n🔢 *Your Code:* *${pairingCode}*\n\n📋 *How to Connect:*\n1️⃣ Open WhatsApp on your phone\n2️⃣ Tap Settings (or ⋮ menu)\n3️⃣ Select "Linked Devices"\n4️⃣ Tap "Link a Device"\n5️⃣ Enter this code: *${pairingCode}*\n\n⚠️ *Important:*\n• Code expires in 2 minutes\n• Make sure you have stable internet\n• Don't share this code with anyone\n\n🔗 Channel: https://whatsapp.com/channel/0029Vb7x5E817En3hMhKxf36`
        }, { quoted: mek });

        // Send just the code
        await reply(`${pairingCode}`);

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair2 error:", error.message);
        await reply("❌ *Error:* Failed to generate pairing code");
    }
});
const { cmd, commands } = require('../arslan');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "pairing", "clonebot"],
    react: "✅",
    desc: "Get pairing code for SANA MD MINI bot",
    category: "download",
    use: ".pair 947707***",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Extract phone number from command
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number format
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ *Please provide a valid phone number without `+`*\n\n> කරුණාකර '+' ලකුණ රහිතව නිවැරදි දුරකථන අංකයක් ඇතුළත් කරන්න.\n\n💡 *Example:* `.pair 94770740571`");
        }

        // Make API request to get pairing code
        const response = await axios.get(`https://arslan-mini-bot-e4ec84c138eb.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await reply("❌ *Failed to retrieve pairing code!* Please try again later.\n\n> Pairing Code එක ලබා ගැනීමට නොහැකි විය. පසුව නැවත උත්සාහ කරන්න.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> 🔮 *SANA MD MINI BOT PAIRING COMPLETED* 🔮";

        // Send initial message with formatting
        await reply(`${doneMessage}\n\n*Your pairing code is:* \`${pairingCode}\``);

        // Optional 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send clean code again
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ *An error occurred while getting pairing code!* Please try again later.");
    }
});

cmd({
    pattern: "pair2",
    alias: ["getpair2", "reqpair", "clonebot2"],
    react: "⏳",
    desc: "Get pairing code for SANA MD MINI bot (With Image)",
    category: "download",
    use: ".pair2 947707XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Check if in group
        if (isGroup) {
            return await reply("❌ *This command only works in private chat!* Please message me directly.\n\n> මෙම විධානය භාවිත කළ හැක්කේ Inbox (Private Chat) තුළ පමණි. කරුණාකර බොට් වෙත සෘජුවම මැසේජ් එකක් දමන්න.");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Extract phone number
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ *Invalid phone number format!*\n\n> දුරකථන අංකය වැරදියි. කරුණාකර '+' ලකුණ රහිතව ඇතුළත් කරන්න.\n\n💡 *Use:* `.pair2 94770740571`");
        }

        // Get pairing code from API
        const response = await axios.get(`https://arslan-mini-bot-e4ec84c138eb.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);
        
        if (!response.data?.code) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return await reply("❌ *Failed to get pairing code!* Please try again later.");
        }

        const pairingCode = response.data.code;
        
        // Send image with caption (Using your custom logo link)
        await conn.sendMessage(from, {
            image: { url: "https://i.postimg.cc/dtfrgJRn/download-(6).jpg" },
            caption: `✨ *SANA MD MINI BOT PAIRING* ✨\n\nNotification has been sent to your WhatsApp. Please check your notifications and link your device using the code below.\n\n> ඔබගේ දුරකථනයට පැමිණි Notification එක මත ක්ලික් කර පහත කේතය ඇතුළත් කරන්න.\n\n🔢 *Pairing Code:* *${pairingCode}*\n\n*Owner:* SANA MD\n*Contact:* +94770740571\n\n> *Copy it from the message below 👇🏻*`
        }, { quoted: m });

        // Send clean code separately
        await reply(pairingCode);
        
        // Add ✅ reaction to the clean code message
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ *An error occurred.* Please try again later.\n\n> කිසියම් දෝෂයක් සිදු විය. පසුව නැවත උත්සාහ කරන්න.");
    }
});

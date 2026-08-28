```js
// ═══════════════════════════════════════════════════════════════════════════
//  📱 PAIR CODE COMMAND - SANA MD MINI BOT
// ═══════════════════════════════════════════════════════════════════════════

const { cmd } = require('../arslan');
const axios = require('axios');

// Railway Pairing API
const PAIR_API = 'https://sanamdminibot-production.up.railway.app';

// ═══════════════════════════════════════════════════════════════════════
//  🔗 PAIR COMMAND
// ═══════════════════════════════════════════════════════════════════════

cmd({
    pattern: "pair",
    alias: ["getpair", "pairing", "code"],
    react: "🔐",
    desc: "Get WhatsApp pairing code",
    category: "main",
    use: ".pair 947XXXXXXXX",
    filename: __filename
}, async (conn, mek, m, {
    from,
    quoted,
    body,
    isCmd,
    command,
    args,
    q,
    isGroup,
    senderNumber,
    reply
}) => {
    try {

        // Extract phone number
        const phoneNumber = q
            ? q.trim().replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        // Validate number
        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(
                `❌ *Invalid Number*\n\n` +
                `Please provide your WhatsApp number with country code.\n\n` +
                `*Example:* \`${command} 94770740571\``
            );
        }

        // Processing reaction
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // Railway API
        const apiUrl = `${PAIR_API}/code?number=${encodeURIComponent(phoneNumber)}`;

        console.log("Pair API:", apiUrl);

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        // Check response
        if (!response.data || !response.data.code) {

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return await reply(
                "❌ *Failed to generate pairing code.*\n\n" +
                "Please try again later."
            );
        }

        const pairingCode = response.data.code;

        // Send pairing code
        await conn.sendMessage(from, {
            image: {
                url: "https://i.postimg.cc/dtfrgJRn/download-(6).jpg"
            },
            caption:
                `✅ *Pairing Code Generated*\n\n` +
                `🔢 *Code:* \`${pairingCode}\`\n\n` +
                `📱 *Instructions:*\n` +
                `1. Open WhatsApp on your phone\n` +
                `2. Go to Settings → Linked Devices\n` +
                `3. Tap "Link a Device"\n` +
                `4. Enter the code above\n\n` +
                `⏰ *Note:* Code expires in 2 minutes`
        }, {
            quoted: mek
        });

        // Send clean code separately
        await reply(`\`${pairingCode}\``);

        // Success reaction
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (error) {

        console.error(
            "Pair command error:",
            error.response?.data || error.message
        );

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        await reply(
            "❌ *Failed to generate pairing code.*\n\n" +
            "Railway pairing server is unavailable or returned an error.\n\n" +
            "Please try again later."
        );
    }
});


// ═══════════════════════════════════════════════════════════════════════
//  🔗 PAIR2 COMMAND - Detailed
// ═══════════════════════════════════════════════════════════════════════

cmd({
    pattern: "pair2",
    alias: ["getpair2", "linkdevice"],
    react: "📱",
    desc: "Get pairing code with detailed instructions",
    category: "main",
    use: ".pair2 947XXXXXXXX",
    filename: __filename
}, async (conn, mek, m, {
    from,
    quoted,
    body,
    isCmd,
    command,
    args,
    q,
    isGroup,
    senderNumber,
    reply
}) => {

    try {

        // Only private chat
        if (isGroup) {
            return await reply(
                "❌ *This command only works in private chat.*\n\n" +
                "Please message me directly."
            );
        }

        // Extract phone number
        const phoneNumber = q
            ? q.trim().replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        // Validate
        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(
                `❌ *Invalid Number*\n\n` +
                `Please provide your WhatsApp number.\n\n` +
                `*Example:* \`${command} 94770740571\``
            );
        }

        // Processing
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // Railway API
        const apiUrl = `${PAIR_API}/code?number=${encodeURIComponent(phoneNumber)}`;

        console.log("Pair2 API:", apiUrl);

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        // Check response
        if (!response.data || !response.data.code) {

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return await reply(
                "❌ *Failed to generate code.*\n\n" +
                "Server might be busy. Please try again."
            );
        }

        const pairingCode = response.data.code;

        // Detailed message
        await conn.sendMessage(from, {
            image: {
                url: "https://i.postimg.cc/dtfrgJRn/download-(6).jpg"
            },
            caption:
                `🔐 *SANA MD MINI BOT - Pairing*\n\n` +
                `✅ Code generated successfully!\n\n` +
                `🔢 *Your Code:* *${pairingCode}*\n\n` +
                `📋 *How to Connect:*\n` +
                `1️⃣ Open WhatsApp on your phone\n` +
                `2️⃣ Tap Settings (or ⋮ menu)\n` +
                `3️⃣ Select "Linked Devices"\n` +
                `4️⃣ Tap "Link a Device"\n` +
                `5️⃣ Enter this code: *${pairingCode}*\n\n` +
                `⚠️ *Important:*\n` +
                `• Code expires in 2 minutes\n` +
                `• Make sure you have stable internet\n` +
                `• Don't share this code with anyone\n\n` +
                `🔗 Channel: https://whatsapp.com/channel/0029Vb7uex51iUxjEPCWJb3u`
        }, {
            quoted: mek
        });

        // Send only code
        await reply(`${pairingCode}`);

        // Success reaction
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (error) {

        console.error(
            "Pair2 error:",
            error.response?.data || error.message
        );

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        await reply(
            "❌ *Failed to generate pairing code.*\n\n" +
            "Railway pairing server is unavailable.\n" +
            "Please try again later."
        );
    }
});
```

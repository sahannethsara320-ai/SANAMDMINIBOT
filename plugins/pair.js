// ═══════════════════════════════════════════════════════════════════════════
//  📱 PAIR CODE COMMAND - SANA MD MINI BOT
// ═══════════════════════════════════════════════════════════════════════════

const { cmd } = require('../arslan');
const axios = require('axios');

// Railway Pair API
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
                `📌 *Example:* \`${command} 94770740571\``
            );
        }

        // Processing reaction
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // ═══════════════════════════════════════════════════════════════
        // Railway Pair API
        // ═══════════════════════════════════════════════════════════════

        const apiUrl =
            `${PAIR_API}/pair?number=${encodeURIComponent(phoneNumber)}`;

        console.log(`🔗 Pair API Request: ${apiUrl}`);

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        // Check API response
        if (
            !response.data ||
            !response.data.code
        ) {
            console.log("❌ Pair API Response:", response.data);

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return await reply(
                "❌ *Failed to generate pairing code.*\n\n" +
                "The pairing server may be busy or the number may already be paired.\n\n" +
                "Please try again."
            );
        }

        const pairingCode = response.data.code;

        // ═══════════════════════════════════════════════════════════════
        // Success Message
        // ═══════════════════════════════════════════════════════════════

        await conn.sendMessage(from, {
            image: {
                url: "https://i.postimg.cc/dtfrgJRn/download-(6).jpg"
            },
            caption:
                `╭━━━〔 *SANA MD MINI BOT* 〕━━━┈⊷\n` +
                `┃\n` +
                `┃ 🔐 *PAIRING CODE GENERATED*\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━┈⊷\n\n` +

                `🔢 *CODE:* \`${pairingCode}\`\n\n` +

                `📱 *HOW TO CONNECT*\n\n` +
                `1️⃣ Open WhatsApp\n` +
                `2️⃣ Go to *Settings*\n` +
                `3️⃣ Select *Linked Devices*\n` +
                `4️⃣ Tap *Link a Device*\n` +
                `5️⃣ Select *Link with phone number instead*\n` +
                `6️⃣ Enter the code above\n\n` +

                `⚠️ *IMPORTANT*\n` +
                `• Code expires shortly\n` +
                `• Use the code immediately\n` +
                `• Don't share your pairing code\n\n` +

                `🚀 *SANA MD MINI BOT*`
        }, {
            quoted: mek
        });

        // Send clean code separately for easy copying
        await reply(`\`${pairingCode}\``);

        // Success reaction
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

        console.log(
            `✅ Pairing code generated for ${phoneNumber}`
        );

    } catch (error) {

        console.error(
            "❌ Pair command error:",
            error.response?.data || error.message
        );

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        }).catch(() => {});

        let errorMessage =
            "❌ *Failed to generate pairing code.*";

        if (error.code === 'ECONNABORTED') {
            errorMessage =
                "❌ *Pairing server timeout.*\n\nPlease try again.";
        }

        if (error.response?.data?.error) {
            errorMessage =
                `❌ *${error.response.data.error}*`;
        }

        await reply(errorMessage);
    }
});


// ═══════════════════════════════════════════════════════════════════════
//  🔗 PAIR2 COMMAND - Detailed Pairing
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

        // Extract number
        const phoneNumber = q
            ? q.trim().replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        // Validate
        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(
                `❌ *Invalid Number*\n\n` +
                `Please provide your WhatsApp number with country code.\n\n` +
                `📌 *Example:* \`${command} 94770740571\``
            );
        }

        // Processing reaction
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // ═══════════════════════════════════════════════════════════════
        // Railway Pair API
        // ═══════════════════════════════════════════════════════════════

        const apiUrl =
            `${PAIR_API}/pair?number=${encodeURIComponent(phoneNumber)}`;

        console.log(`🔗 Pair2 API Request: ${apiUrl}`);

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        // Check response
        if (
            !response.data ||
            !response.data.code
        ) {
            console.log("❌ Pair2 API Response:", response.data);

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return await reply(
                "❌ *Failed to generate pairing code.*\n\n" +
                "Server might be busy. Please try again."
            );
        }

        const pairingCode = response.data.code;

        // ═══════════════════════════════════════════════════════════════
        // Detailed Pair Message
        // ═══════════════════════════════════════════════════════════════

        await conn.sendMessage(from, {
            image: {
                url: "https://i.postimg.cc/dtfrgJRn/download-(6).jpg"
            },
            caption:
                `╭━━━〔 *SANA MD MINI BOT* 〕━━━┈⊷\n` +
                `┃\n` +
                `┃ 🔐 *PAIRING SYSTEM*\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━┈⊷\n\n` +

                `✅ *Pairing code generated successfully!*\n\n` +

                `🔢 *YOUR CODE*\n` +
                `\`${pairingCode}\`\n\n` +

                `📋 *HOW TO CONNECT*\n\n` +
                `1️⃣ Open WhatsApp on your phone\n` +
                `2️⃣ Go to *Settings*\n` +
                `3️⃣ Tap *Linked Devices*\n` +
                `4️⃣ Tap *Link a Device*\n` +
                `5️⃣ Select *Link with phone number instead*\n` +
                `6️⃣ Enter this code:\n\n` +
                `🔑 *${pairingCode}*\n\n` +

                `⚠️ *IMPORTANT*\n` +
                `• Use the code immediately\n` +
                `• Pairing codes expire shortly\n` +
                `• Never share your code with anyone\n\n` +

                `🚀 *SANA MD MINI BOT*`
        }, {
            quoted: mek
        });

        // Clean code
        await reply(`${pairingCode}`);

        // Success reaction
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

        console.log(
            `✅ Pair2 code generated for ${phoneNumber}`
        );

    } catch (error) {

        console.error(
            "❌ Pair2 error:",
            error.response?.data || error.message
        );

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        }).catch(() => {});

        await reply(
            "❌ *Failed to generate pairing code.*\n\n" +
            "Please try again later."
        );
    }
});
```

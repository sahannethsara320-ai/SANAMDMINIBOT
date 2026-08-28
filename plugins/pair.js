const { cmd } = require('../arslan');
const axios = require('axios');

const PAIR_API = 'https://sanamdminibot-production.up.railway.app';

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
        const phoneNumber = q
            ? q.trim().replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(
                `❌ *Invalid Number*\n\n` +
                `Please provide your WhatsApp number with country code.\n\n` +
                `*Example:* \`${command} 94770740571\``
            );
        }

        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        const apiUrl = `${PAIR_API}/code?number=${encodeURIComponent(phoneNumber)}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000,
            proxy: false,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

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

        await reply(`\`${pairingCode}\``);

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (error) {
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
        if (isGroup) {
            return await reply(
                "❌ *This command only works in private chat.*\n\n" +
                "Please message me directly."
            );
        }

        const phoneNumber = q
            ? q.trim().replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10) {
            return await reply(
                `❌ *Invalid Number*\n\n` +
                `Please provide your WhatsApp number.\n\n` +
                `*Example:* \`${command} 94770740571\``
            );
        }

        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        const apiUrl = `${PAIR_API}/code?number=${encodeURIComponent(phoneNumber)}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000,
            proxy: false,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

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

        await reply(`${pairingCode}`);

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (error) {
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

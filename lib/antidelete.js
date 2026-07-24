const { getAntideleteStatus } = require('../data/Antidelete');
const config = require('../config');

const handleAntidelete = async (conn, updates, store) => {
    try {
        for (const update of updates) {
            if (update.key.fromMe) continue;

            const isRevoke = update.update.messageStubType === 68 || 
                             (update.update.message && 
                              update.update.message.protocolMessage && 
                              update.update.message.protocolMessage.type === 0);

            if (isRevoke) {
                const chatId = update.key.remoteJid;
                const messageId = update.key.id;
                const participant = update.key.participant || chatId;

                const isEnabled = await getAntideleteStatus(chatId);
                if (!isEnabled) return;

                if (!store || !store.messages[chatId]) return;
                const msg = await store.loadMessage(chatId, messageId);

                if (msg) {
                    const alertText = `
🚫 *SANA MD ANTI-DELETE* 🚫

👤 *මකන ලද පුද්ගලයා:* @${participant.split('@')[0]}
📅 *දිනය සහ වේලාව:* ${new Date().toLocaleString()}

👇 *මකන ලද පණිවිඩය පහතින්:*
`;
                    await conn.sendMessage(chatId, { text: alertText, mentions: [participant] });
                    await conn.sendMessage(chatId, { forward: msg, contextInfo: { isForwarded: false } }, { quoted: msg });
                }
            }
        }
    } catch (e) { console.error("Antidelete Error:", e); }
};

module.exports = { handleAntidelete };

const { cmd } = require('../arslan');

cmd({
    pattern: "online",
    alias: ["whosonline", "onlinemembers"],
    desc: "Check who's online in the group (Admins & Owner only)",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, quoted, isGroup, isAdmins, isCreator, fromMe, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("*❌ මෙම Command එක භාවිත කළ හැක්කේ සමූහ (Groups) තුළ පමණි! 😊*");

        // Check if user is either creator or admin
        if (!isCreator && !isAdmins && !fromMe) {
            return reply("*😎 මෙම Command එක පාවිච්චි කළ හැක්කේ බොට්ගේ අයිතිකරුට (Owner) සහ ගෘප් ඇඩ්මින්වරුන්ට (Admins) පමණි! ❣️*");
        }

        // Inform user that we're checking
        await reply("*🟢 ඔන්ලයින් සිටින සාමාජිකයන්ගේ ලැයිස්තුව සකස් කරමින් පවතී...*\n*කරුණාකර තත්පර කිහිපයක් රැඳී සිටින්න... 😊*");

        const onlineMembers = new Set();
        const groupData = await conn.groupMetadata(from);
        const presencePromises = [];

        // Request presence updates for all participants
        for (const participant of groupData.participants) {
            presencePromises.push(
                conn.presenceSubscribe(participant.id)
                    .then(() => {
                        // Additional check for better detection
                        return conn.sendPresenceUpdate('composing', participant.id);
                    })
            );
        }

        await Promise.all(presencePromises);

        // Presence update handler
        const presenceHandler = (json) => {
            for (const id in json.presences) {
                const presence = json.presences[id]?.lastKnownPresence;
                // Check all possible online states
                if (['available', 'composing', 'recording', 'online'].includes(presence)) {
                    onlineMembers.add(id);
                }
            }
        };

        conn.ev.on('presence.update', presenceHandler);

        // Longer timeout and multiple checks
        const checks = 3;
        const checkInterval = 5000; // 5 seconds
        let checksDone = 0;

        const checkOnline = async () => {
            checksDone++;
            
            if (checksDone >= checks) {
                clearInterval(interval);
                conn.ev.off('presence.update', presenceHandler);
                
                if (onlineMembers.size === 0) {
                    return reply("⚠️ දැනට ඔන්ලයින් සිටින කිසිදු සාමාජිකයෙකු සොයාගත නොහැකි විය. (සමහර විට ඔවුන්ගේ Privacy සෙටින්ග්ස් නිසා විය හැක)");
                }
                
                const onlineArray = Array.from(onlineMembers);
                const onlineList = onlineArray.map((member, index) => 
                    `${index + 1}. @${member.split('@')[0]}`
                ).join('\n');
                
                const message = `*👑 SANA MD ONLINE MEMBERS 👑*\n📊 පැමිණීම (${onlineArray.length}/${groupData.participants.length}):\n\n${onlineList}`;
                
                await conn.sendMessage(from, { 
                    text: message,
                    mentions: onlineArray
                }, { quoted: mek });
            }
        };

        const interval = setInterval(checkOnline, checkInterval);

    } catch (e) {
        console.error("Error in online command:", e);
        reply(`දෝෂයක් ඇති විය: ${e.message}`);
    }
});

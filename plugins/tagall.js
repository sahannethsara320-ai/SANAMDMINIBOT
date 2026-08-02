const { cmd } = require('../arslan');

cmd({
    pattern: "tagall",
    alias: ["all", "mentionall", "tag"],
    react: "📢",
    desc: "Tag all group members (Admin only)",
    category: "group",
    use: ".tagall <message>",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, participants, body, args, reply }) => {
    try {
        // Check if in group
        if (!isGroup) {
            return reply("❌ *This command only works in groups!*");
        }

        // Check if admin or owner
        if (!isAdmins && !isOwner) {
            return reply("❌ *Only group admins can use this command!*");
        }

        // Get message text
        const text = args.join(" ") || "📢 Attention everyone!";

        // Get all participants
        const groupMetadata = await conn.groupMetadata(from);
        const allMembers = groupMetadata.participants.map(p => p.id);

        // Create mentions text
        let mentionsText = `*📢 MESSAGE FROM ADMIN*\n\n`;
        mentionsText += `${text}\n\n`;
        mentionsText += `*👥 Tagged Members:*\n`;

        allMembers.forEach((member, index) => {
            mentionsText += `${index + 1}. @${member.split('@')[0]}\n`;
        });

        mentionsText += `\n> Powered by SANA MD`;

        // Send message with mentions
        await conn.sendMessage(from, {
            text: mentionsText,
            mentions: allMembers
        }, { quoted: mek });

    } catch (error) {
        console.error("Tagall error:", error);
        reply("❌ Error: " + error.message);
    }
});
const { cmd } = require('../arslan');

cmd({
    pattern: "tagall",
    alias: ["all", "mentionall", "tag"],
    react: "📢",
    desc: "Tag all group members",
    category: "group",
    use: ".tagall <message>",
    filename: __filename
},
async (conn, mek, m, {
    from,
    isGroup,
    isAdmins,
    isOwner,
    args,
    reply
}) => {

    try {

        // Group only
        if (!isGroup) {
            return reply("❌ *This command only works in groups!*");
        }

        // Load @all settings
        global.atallSettings = global.atallSettings || {};

        const mode = global.atallSettings[from] || "off";

        // Permission check
        if (mode === "admin") {
            if (!isAdmins && !isOwner) {
                return reply("❌ *Only group admins can use @all!*");
            }
        }

        if (mode === "off") {
            if (!isAdmins && !isOwner) {
                return reply("❌ *@all is disabled for members!*");
            }
        }

        // Get message
        const text = args.join(" ") || "📢 Attention everyone!";

        // Get group members
        const groupMetadata = await conn.groupMetadata(from);
        const allMembers = groupMetadata.participants.map(p => p.id);

        // Build message
        let mentionsText = `*📢 MESSAGE TO ALL MEMBERS*\n\n`;
        mentionsText += `${text}\n\n`;
        mentionsText += `*👥 Tagged Members*\n\n`;

        allMembers.forEach((member, index) => {
            mentionsText += `${index + 1}. @${member.split("@")[0]}\n`;
        });

        mentionsText += `\n> Powered By SANA MD`;

        // Send message
        await conn.sendMessage(
            from,
            {
                text: mentionsText,
                mentions: allMembers
            },
            {
                quoted: mek
            }
        );

    } catch (e) {
        console.log("Tagall Error:", e);
        reply("❌ Error: " + e.message);
    }

});

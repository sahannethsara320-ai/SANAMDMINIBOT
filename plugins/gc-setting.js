const { sleep } = require('../lib/functions');
const config = require('../config');
const { cmd } = require("../arslan");
const { fakevCard } = require('../lib/fakevCard');

// Command to list all pending group join requests
cmd({
    pattern: "requestlist",
    desc: "Shows pending group join requests",
    category: "group",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *I need to be an admin to view join requests.*\n(මට Join Requests බැලීමට නම් මාව Admin කෙනෙකු කළ යුතුය.)");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: 'ℹ️', key: m.key }
            });
            return reply("✨ *SANA MD MINI BOT* ✨\n\nℹ️ *No pending join requests.*\n(දැනට කිසිදු Pending Join Request එකක් නොමැත.)");
        }

        let text = `✨ *SANA MD MINI BOT* ✨\n\n📋 *Pending Join Requests (${requests.length})*\n\n`;
        requests.forEach((user, i) => {
            text += `🔹 ${i+1}. @${user.jid.split('@')[0]}\n`;
        });
        text += `\n*Owner:* SANA MD 🍁`;

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });
        return reply(text, { mentions: requests.map(u => u.jid) });
    } catch (error) {
        console.error("Request list error:", error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        return reply("❌ *Failed to fetch join requests.*\n(Request ලැයිස්තුව ලබා ගැනීමට නොහැකි විය.)");
    }
});

// Command to accept all pending join requests
cmd({
    pattern: "acceptall",
    desc: "Accepts all pending group join requests",
    category: "group",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *I need to be an admin to accept join requests.*\n(Requests Accept කිරීමට මාව Admin කෙනෙකු කළ යුතුය.)");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: 'ℹ️', key: m.key }
            });
            return reply("✨ *SANA MD MINI BOT* ✨\n\nℹ️ *No pending join requests to accept.*\n(Accept කිරීමට Requests කිසිවක් නොමැත.)");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "approve");
        
        await conn.sendMessage(from, {
            react: { text: '👍', key: m.key }
        });
        return reply(`✨ *SANA MD MINI BOT* ✨\n\n✅ *Successfully accepted ${requests.length} join requests!*\n(සියලුම Join Requests සාර්ථකව Accept කරන ලදී!)`);
    } catch (error) {
        console.error("Accept all error:", error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        return reply("❌ *Failed to accept join requests.*\n(Requests Accept කිරීමට නොහැකි විය.)");
    }
});

// Command to reject all pending join requests
cmd({
    pattern: "rejectall",
    desc: "Rejects all pending group join requests",
    category: "group",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *I need to be an admin to reject join requests.*\n(Requests Reject කිරීමට මාව Admin කෙනෙකු කළ යුතුය.)");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: 'ℹ️', key: m.key }
            });
            return reply("✨ *SANA MD MINI BOT* ✨\n\nℹ️ *No pending join requests to reject.*\n(Reject කිරීමට Requests කිසිවක් නොමැත.)");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "reject");
        
        await conn.sendMessage(from, {
            react: { text: '👎', key: m.key }
        });
        return reply(`✨ *SANA MD MINI BOT* ✨\n\n✅ *Successfully rejected ${requests.length} join requests!*\n(සියලුම Join Requests ප්‍රතික්ෂේප කරන ලදී!)`);
    } catch (error) {
        console.error("Reject all error:", error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        return reply("❌ *Failed to reject join requests.*\n(Requests Reject කිරීමට නොහැකි විය.)");
    }
});

// ==================== SIMPLE & WORKING KICK COMMAND ====================
cmd({
    pattern: "kick",
    alias: ["remove","k"],
    desc: "Remove a group member",
    category: "admin",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");

        if (!isAdmins) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");

        if (!isBotAdmins) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *I need admin rights to remove members.*\n(සාමාජිකයන් ඉවත් කිරීමට මට Admin බලතල අවශ්‍ය වේ.)");

        const target = m.quoted?.sender || m.mentionedJid?.[0];

        if (!target) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Reply to a message or mention a user!*\n(කරුණාකර ඉවත් කිරීමට අවශ්‍ය අයව Mention කරන්න හෝ Reply කරන්න!)");

        // remove user
        await conn.groupParticipantsUpdate(
            from,
            [target],
            "remove"
        );

        await conn.sendMessage(from,{
            text:`🍁 *SANA MD MINI BOT* 🍁\n\n🚫 @${target.split("@")[0]} *has been successfully removed!*\n(සමූහයෙන් සාර්ථකව ඉවත් කරන ලදී!)`,
            mentions:[target]
        },{ quoted:m });

    } catch (error) {
        console.error("Kick error:", error);
        reply("❌ *Failed to remove member.*\n(සාමාජිකයා ඉවත් කිරීමට නොහැකි විය.)");
    }
});
// ==================== SIMPLE & WORKING KICKALL COMMAND ====================
cmd({
    pattern: "kickall",
    desc: "Remove all non-admin members",
    category: "admin",
    react: "⚠️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) {
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        }
        if (!isAdmins) {
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");
        }
        if (!isBotAdmins) {
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *I need admin rights to kick members.*\n(සාමාජිකයන් ඉවත් කිරීමට මට Admin බලතල අවශ්‍ය වේ.)");
        }

        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants;

        // admins list
        const admins = participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);

        // bot jid
        let botJid = conn.user.id.includes(':')
            ? conn.user.id.split(':')[0] + "@s.whatsapp.net"
            : conn.user.id;

        // remove list (admins skip)
        const toKick = participants
            .map(p => p.id)
            .filter(id => !admins.includes(id) && id !== botJid);

        if (toKick.length === 0) {
            return reply("✨ *SANA MD MINI BOT* ✨\n\nℹ️ *No non-admin members to remove.*\n(ඉවත් කිරීමට Admin නොවන සාමාජිකයන් කිසිවෙකු නොමැත.)");
        }

        await reply(`⚠️ *SANA MD MINI BOT* ⚠️\n\n⚙️ *Removing ${toKick.length} members...*\n(සාමාජිකයන් ${toKick.length} දෙනා බැගින් ඉවත් කිරීම ආරම්භ කළා...)`);

        for (let user of toKick) {
            await conn.groupParticipantsUpdate(from, [user], "remove");
            await sleep(1500); // Added delay to prevent WhatsApp numbers from getting banned
        }

        await reply("✨ *SANA MD MINI BOT* ✨\n\n✅ *Kickall process completed successfully!*\n(සියලුම සාමාජිකයන් ඉවත් කර අවසන්!)");

    } catch (err) {
        console.log(err);
        reply("❌ *Kickall process failed!*\n(Kickall ක්‍රියාවලිය අසාර්ථක විය.)");
    }
});

//REMOVE ADMINS BY ARSLAN-MD OFFICIAL (EDITED FOR SANA MD)
cmd({
    pattern: "removeadmins",
    alias: ["kickadmins", "kickall3", "deladmins"],
    desc: "Remove all admin members from the group, excluding the bot and bot owner.",
    react: "🎉",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, isGroup, senderNumber, groupMetadata, groupAdmins, isBotAdmins, reply
}) => {
    try {
        if (!isGroup) {
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        }

        // Dynamic Owner Check
        const botOwner = "94770740571"; // Your registered number
        if (senderNumber !== botOwner) {
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only the bot owner (SANA MD) can use this command.*\n(මෙය භාවිතා කිරීමට බොට් අයිතිකරුට පමණක් අවසර ඇත.)");
        }

        if (!isBotAdmins) {
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *I need to be an admin to execute this command.*\n(මෙය සිදු කිරීමට මාව Admin කෙනෙකු කළ යුතුය.)");
        }

        const allParticipants = groupMetadata.participants;
        const adminParticipants = allParticipants.filter(member => groupAdmins.includes(member.id) && member.id !== conn.user.id && member.id !== `${botOwner}@s.whatsapp.net`);

        if (adminParticipants.length === 0) {
            return reply("✨ *SANA MD MINI BOT* ✨\n\nℹ️ *There are no admin members to remove.*\n(ඉවත් කිරීමට වෙනත් Adminවරුන් නොමැත.)");
        }

        reply(`⚠️ *SANA MD MINI BOT* ⚠️\n\n⚙️ *Removing ${adminParticipants.length} admin members...*\n(Adminsලා ${adminParticipants.length} දෙනා ඉවත් කිරීම ආරම්භ කළා...)`);

        for (let participant of adminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000); 
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✨ *SANA MD MINI BOT* ✨\n\n✅ *Successfully removed all admin members from the group!*\n(සියලුම Admin සාමාජිකයන් සාර්ථකව ඉවත් කරන ලදී!)");
    } catch (e) {
        console.error("Error removing admins:", e);
        reply("❌ *An error occurred while trying to remove admins.*\n(Adminsලා ඉවත් කිරීමට යාමේදී දෝෂයක් ඇති විය.)");
    }
});

// ==================== SIMPLE & WORKING PROMOTE COMMAND ====================
cmd({
    pattern: "promote",
    alias: ["p", "giveadmin", "makeadmin"],
    desc: "Promote a user to admin",
    category: "group",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, {
    from, isGroup, quoted, reply, mentionedJid, sender, isBotAdmins, isAdmins
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        if (!isAdmins) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");
        if (!isBotAdmins) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Bot needs to be admin to promote users.*\n(මට කාසි දීමට නම් මාව Admin කෙනෙකු කළ යුතුය.)");

        let users = [];  
        if (mentionedJid && mentionedJid.length > 0) {  
            users = mentionedJid;  
        } else if (quoted && quoted.sender) {  
            users = [quoted.sender];  
        } else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid) {  
            users = m.message.extendedTextMessage.contextInfo.mentionedJid;  
        } else {  
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❓ *Please mention or quote a user to promote!*\nExample: .promote @user");  
        }  

        users = [...new Set(users.filter(user => user && user.includes('@')))];  
        if (users.length === 0) return reply("❌ *Couldn't determine target user.*");  

        try {  
            await conn.groupParticipantsUpdate(from, users, "promote");  
            
            if (users.length === 1) {  
                reply(`✨ *SANA MD MINI BOT* ✨\n\n👑 @${users[0].split('@')[0]} *has been successfully promoted to admin!*`, { mentions: users });  
            } else {  
                reply(`✨ *SANA MD MINI BOT* ✨\n\n👑 *Successfully promoted ${users.length} users to admin!*`, { mentions: users });  
            }  
        } catch (promoteError) {  
            if (promoteError.message.includes("already")) {  
                reply("❌ *User is already an admin!*\n(මෙම පරිශීලකයා දැනටමත් Admin කෙනෙකි.)");  
            } else {  
                reply("❌ *Failed to promote:* " + promoteError.message);  
            }  
        }

    } catch (err) {
        console.error("Promote Error:", err);
        reply("❌ *Failed to promote user.*");
    }
});

// ==================== SIMPLE & WORKING DEMOTE COMMAND ====================
cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demote a group admin",
    category: "group",
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, {
    from, isGroup, quoted, reply, mentionedJid, sender, isBotAdmins, isAdmins
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        if (!isAdmins) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");
        if (!isBotAdmins) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Bot needs to be admin to demote users.*\n(තනතුරු ඉවත් කිරීමට මාව Admin කෙනෙකු කළ යුතුය.)");

        let users = [];  
        if (mentionedJid && mentionedJid.length > 0) {  
            users = mentionedJid;  
        } else if (quoted && quoted.sender) {  
            users = [quoted.sender];  
        } else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid) {  
            users = m.message.extendedTextMessage.contextInfo.mentionedJid;  
        } else {  
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❓ *Please mention or quote an admin to demote!*\nExample: .demote @admin");  
        }  

        users = [...new Set(users.filter(user => user && user.includes('@')))];  
        if (users.length === 0) return reply("❌ *Couldn't determine target user.*");  

        try {  
            await conn.groupParticipantsUpdate(from, users, "demote");  
            
            if (users.length === 1) {  
                reply(`✨ *SANA MD MINI BOT* ✨\n\n⬇️ @${users[0].split('@')[0]} *has been successfully demoted from admin!*`, { mentions: users });  
            } else {  
                reply(`✨ *SANA MD MINI BOT* ✨\n\n⬇️ *Successfully demoted ${users.length} admins!*`, { mentions: users });  
            }  
        } catch (demoteError) {  
            if (demoteError.message.includes("not admin")) {  
                reply("❌ *User is not an admin!*\n(ඔහු Admin කෙනෙක් නොවේ.)");  
            } else {  
                reply("❌ *Failed to demote:* " + demoteError.message);  
            }  
        }

    } catch (err) {
        console.error("Demote Error:", err);
        reply("❌ *Failed to demote user.*");
    }
});
// ==================== WORKING BOT ADMIN COMMAND ====================
cmd({
    pattern: "botadmin",
    alias: ["makebotadmin", "giveadminbot", "adminbot"],
    desc: "Make bot admin in group",
    category: "group",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, {
    from, isGroup, reply, isCreator
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");

        // Check if bot is already admin  
        try {  
            const groupMetadata = await conn.groupMetadata(from);  
            const botParticipant = groupMetadata.participants.find(p => p.id === conn.user.id);  
            if (botParticipant && botParticipant.admin) {  
                return reply("✨ *SANA MD MINI BOT* ✨\n\n✅ *Bot is already admin in this group!*\n(බොට් දැනටමත් මෙම සමූහයේ Admin කෙනෙකි!)");  
            }  
        } catch (e) {  
            console.log("Could not fetch group metadata, trying to promote bot...");  
        }  
  
        // Try to promote bot  
        try {  
            await conn.groupParticipantsUpdate(from, [conn.user.id], "promote");  
            reply("✨ *SANA MD MINI BOT* ✨\n\n✅ *Bot successfully promoted to admin!*\n(බොට්ව සාර්ථකව Admin කරන ලදී!)\n\nNow you can use:\n• .promote @user\n• .demote @admin\n• .kick @user");  
        } catch (err) {  
            if (err.message.includes("not authorized")) {  
                reply(`⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Failed to make bot admin.*\n(බොට්ව Admin කිරීමට නොහැකි විය.)\n\n✳️ *Reason:* ඔබට බොට්ව Admin කිරීමට තරම් බලතල නොමැත.\n\n✳️ *Manual Method (කරන ක්‍රමය):*\n1. Group Settings වෙත යන්න.\n2. "Group Permissions / Edit Group Admins" ක්ලික් කරන්න.\n3. බොට්ව තෝරා සාමාන්‍ය පරිදි Admin කෙනෙකු කරන්න.`);  
            } else {  
                reply("❌ *Failed to make bot admin:* " + err.message);  
            }  
        }

    } catch (err) {
        console.error("Bot Admin Error:", err);
        reply("❌ *Error in botadmin command.*");
    }
});

// ==================== FIXED ADD USER COMMAND ====================
cmd({
    pattern: "add",
    alias: ["adduser", "addmember"],
    desc: "Add user to group",
    category: "group",
    react: "➕",
    filename: __filename
}, async (conn, mek, m, {
    from, isGroup, reply, isCreator, args = [], mentionedJid, text, body
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");

        let users = [];  
  
        // From Mentioned users (Priority)  
        if (mentionedJid && mentionedJid.length > 0) {  
            users = mentionedJid;  
        }  
  
        // Extract numbers from text  
        if (users.length === 0 && text) {  
            const textString = String(text || "").trim();  
            
            // Pattern 1: Direct numbers  
            const directNumbers = textString.match(/\d{9,15}/g); // Updated for Sri Lankan 9 digits
            if (directNumbers) {  
                users = directNumbers.map(num => {  
                    let cleanNum = num.replace(/\D/g, '');  
                    // Sri Lankan numbers formatting (077... -> 9477...)
                    if (cleanNum.startsWith('0') && cleanNum.length === 10) {  
                        cleanNum = '94' + cleanNum.substring(1);  
                    } else if (cleanNum.startsWith('7') && cleanNum.length === 9) {
                        cleanNum = '94' + cleanNum;
                    }  
                    if (cleanNum.length >= 9) {  
                        return cleanNum + '@s.whatsapp.net';  
                    }  
                    return null;  
                }).filter(Boolean);  
            }  
                
            // Pattern 2: Extract from @ mentions  
            if (users.length === 0) {  
                const mentionPattern = /@(\d{5,16})/g;  
                const mentions = [...textString.matchAll(mentionPattern)];  
                if (mentions.length > 0) {  
                    users = mentions.map(match => match[1] + '@s.whatsapp.net');  
                }  
            }  
        }  
  
        // Extract from message body  
        if (users.length === 0 && body) {  
            const bodyString = String(body);  
            const numbers = bodyString.match(/\d{9,15}/g);  
            if (numbers) {  
                users = numbers.map(num => {  
                    let cleanNum = num.replace(/\D/g, '');  
                    if (cleanNum.startsWith('0') && cleanNum.length === 10) {  
                        cleanNum = '94' + cleanNum.substring(1);  
                    } else if (cleanNum.startsWith('7') && cleanNum.length === 9) {
                        cleanNum = '94' + cleanNum;
                    }  
                    return cleanNum + '@s.whatsapp.net';  
                }).filter(num => num.length >= 9);  
            }  
        }  
  
        if (users.length === 0) {  
            return reply(`⚠️ *SANA MD MINI BOT* ⚠️\n\n❓ *Please mention users or provide phone numbers!*\n(කරුණාකර ඇතුළත් කිරීමට අවශ්‍ය අයව Mention කරන්න හෝ අංකය ලබා දෙන්න!)\n\n*Examples:*\n• .add @user\n• .add 94770740571\n• .add 0770740571`);  
        }  
  
        // Remove duplicates  
        users = [...new Set(users)];  
  
        // Validate users  
        const validUsers = users.filter(user => {  
            const num = user.split('@')[0];  
            return num.length >= 9 && num.length <= 16;  
        });  
  
        if (validUsers.length === 0) {  
            return reply("❌ *Invalid phone numbers!*\n(ලබාදුන් දුරකථන අංකය වලංගු නොවේ.)");  
        }  
  
        // Try to add users  
        try {  
            await conn.groupParticipantsUpdate(from, validUsers, "add");  
            reply(`✨ *SANA MD MINI BOT* ✨\n\n✅ *Successfully added ${validUsers.length} user(s) to the group!*\n(සාමාජිකයන් සාර්ථකව සමූහයට එකතු කරන ලදී!)\n\n*Added:* ${validUsers.map(u => u.split('@')[0]).join(', ')}`);  
        } catch (addError) {  
            if (addError.message.includes("not authorized") || addError.message.includes("admin")) {  
                reply("❌ *Bot needs to be admin to add users!* Use: .botadmin\n(සාමාජිකයන් එකතු කිරීමට මාව Admin කෙනෙකු කළ යුතුය.)");  
            } else if (addError.message.includes("not in contacts")) {  
                reply("❌ *Some users are not in your contacts.*\n(සමහර සාමාජිකයන් ඔබගේ සම්බන්ධතා (Contacts) වල නොමැත.)");  
            } else if (addError.message.includes("invite")) {  
                reply("❌ *Cannot add users.*\n(ඔවුන්ගේ Privacy Settings හේතුවෙන් සමූහයට එකතු කළ නොහැක. Invite Link එකක් යවන්න.)");  
            } else {  
                reply("❌ *Failed to add user:* " + addError.message);  
            }  
        }

    } catch (err) {
        console.error("Add Error:", err);
        reply("❌ *Failed to add user.*");
    }
});
// ==================== SIMPLE ADD COMMAND (ALTERNATIVE VERSION) ====================
cmd({
    pattern: "addmember",
    alias: ["invite", "invitemember"],
    desc: "Add user to group (simple version)",
    category: "group",
    react: "👥",
    filename: __filename
}, async (conn, mek, m, {
    from, isGroup, reply, args, mentionedJid
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");

        let users = [];  
  
        // Mentioned users  
        if (mentionedJid && mentionedJid.length > 0) {  
            users = mentionedJid;  
            console.log("Mentioned users:", users);  
        }  
  
        // If no mentions, check args  
        if (users.length === 0 && args) {  
            const argsString = Array.isArray(args) ? args.join(' ') : String(args || '');  
            console.log("Args string:", argsString);  
              
            // Extract numbers from args  
            const numberRegex = /(\+\d{1,3})?(\d{9,15})/g; // Sri Lankan 9-digit compatibility
            const matches = argsString.match(numberRegex);  
              
            if (matches) {  
                users = matches.map(num => {  
                    let cleanNum = num.replace(/\D/g, '');  
                      
                    // Sri Lankan numbers formatting (077... -> 9477...)
                    if (cleanNum.startsWith('0') && cleanNum.length === 10) {  
                        cleanNum = '94' + cleanNum.substring(1);  
                    } else if (cleanNum.startsWith('7') && cleanNum.length === 9) {
                        cleanNum = '94' + cleanNum;
                    }  
                      
                    // Remove leading zeros  
                    cleanNum = cleanNum.replace(/^0+/, '');  
                      
                    if (cleanNum.length >= 9 && cleanNum.length <= 16) {  
                        return cleanNum + '@s.whatsapp.net';  
                    }  
                    return null;  
                }).filter(Boolean);  
            }  
        }  
  
        // If still no users  
        if (users.length === 0) {  
            return reply(`⚠️ *SANA MD MINI BOT* ⚠️\n\n📋 *Add User Help (උදවු)*\n\n*Usage (භාවිතය):*\n• .addmember @user\n• .addmember 94770740571\n• .addmember 0770740571\n\n*Note:* සාමාජිකයන් ඔබේ Contacts වල සිටීම අනිවාර්ය වේ.`);  
        }  
  
        // Remove duplicates  
        users = [...new Set(users)];  
  
        // Limit to 10 users at a time  
        if (users.length > 10) {  
            reply(`⚠️ *SANA MD MINI BOT* ⚠️\n\n⏳ *Adding first 10 users (limit)...*\n(පළමු සාමාජිකයන් 10 දෙනා පමණක් ඇතුළත් කරනු ලැබේ...)`);  
            users = users.slice(0, 10);  
        }  
  
        console.log("Final users to add:", users);  
  
        // Try to add  
        try {  
            await conn.groupParticipantsUpdate(from, users, "add");  
            reply(`✨ *SANA MD MINI BOT* ✨\n\n✅ *Successfully added ${users.length} user(s) to the group!*\n(සාමාජිකයන් සාර්ථකව සමූහයට එකතු කරන ලදී!)`);  
        } catch (error) {  
            console.error("Add error:", error.message);  
              
            if (error.message.includes("not authorized")) {  
                reply("❌ *Bot is not admin! Please make bot admin first.*\n(බොට් Admin කෙනෙක් නොවේ. කරුණාකර ප්‍රථමයෙන් මාව Admin කරන්න.)");  
            } else if (error.message.includes("invite")) {  
                reply("❌ *Cannot add these users. Privacy settings enabled.*\n(ඔවුන්ගේ Privacy Settings හේතුවෙන් එකතු කිරීමට නොහැක.)");  
            } else {  
                reply(`❌ *Failed to add:* ${error.message}`);  
            }  
        }

    } catch (err) {
        console.error("AddMember Error:", err);
        reply("❌ *Failed to add member.*");
    }
});

// ==================== SIMPLE TAGALL COMMAND ====================
cmd({
    pattern: "tagall",
    alias: ["gc_tagall", "mentionall"],
    desc: "Tag all members",
    category: "group",
    react: "🔊",
    filename: __filename
}, async (conn, mek, m, {
    from, participants, reply, isGroup, body, command
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");

        let message = body.slice(body.indexOf(command) + command.length).trim();  
        if (!message) message = "Attention Everyone! (සියලු දෙනාගේ අවධානය පිණිසයි!)";  
          
        let text = `📢 *SANA MD MINI BOT - TAG ALL* 📢\n\n📝 *Message:* ${message}\n\n`;  
          
        participants.forEach((member, i) => {  
            text += `🔹 ${i+1}. @${member.id.split('@')[0]}\n`;  
        });  
          
        text += `\n✅ *Total:* ${participants.length} Members\n*Owner:* SANA MD 🍁`;  
          
        await conn.sendMessage(from, {  
            text: text,  
            mentions: participants.map(p => p.id)  
        }, { quoted: fakevCard });

    } catch (err) {
        console.error("TagAll Error:", err);
        reply("❌ *Error in tagall command.*");
    }
});

// ==================== HIDETAG COMMAND ====================
cmd({
    pattern: "hidetag",
    alias: ["tag", "h"],  
    react: "🔊",
    desc: "To Tag all Members for Any Message/Media",
    category: "group",
    use: '.hidetag Hello',
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isCreator, isAdmins, participants, reply
}) => {
    try {
        const isUrl = (url) => {
            return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url);
        };

        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        if (!isAdmins && !isCreator) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only group admins can use this command.*\n(මෙය භාවිතා කිරීමට ඔබට Admin බලතල තිබිය යුතුය.)");

        const mentionAll = { mentions: participants.map(u => u.id) };

        // If no message or reply is provided
        if (!q && !m.quoted) {
            return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Please provide a message or reply to a message.*\n(කරුණාකර පණිවිඩයක් ඇතුළත් කරන්න හෝ පණිවිඩයකට Reply කරන්න.)");
        }

        // If a reply to a message
        if (m.quoted) {
            const type = m.quoted.mtype || '';  
            
            if (type === 'extendedTextMessage') {
                return await conn.sendMessage(from, {
                    text: m.quoted.text || 'No message content found.',
                    ...mentionAll
                }, { quoted: mek });
            }

            // Handle media messages
            if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
                try {
                    const buffer = await m.quoted.download?.();
                    if (!buffer) return reply("❌ *Failed to download the quoted media.*");

                    let content;
                    switch (type) {
                        case "imageMessage":
                            content = { image: buffer, caption: m.quoted.text || "📷 Image via SANA MD BOT", ...mentionAll };
                            break;
                        case "videoMessage":
                            content = { 
                                video: buffer, 
                                caption: m.quoted.text || "🎥 Video via SANA MD BOT", 
                                gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false, 
                                ...mentionAll 
                            };
                            break;
                        case "audioMessage":
                            content = { 
                                audio: buffer, 
                                mimetype: "audio/mp4", 
                                ptt: m.quoted.message?.audioMessage?.ptt || false, 
                                ...mentionAll 
                            };
                            break;
                        case "stickerMessage":
                            content = { sticker: buffer, ...mentionAll };
                            break;
                        case "documentMessage":
                            content = {
                                document: buffer,
                                mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
                                fileName: m.quoted.message?.documentMessage?.fileName || "SANA_MD_FILE",
                                caption: m.quoted.text || "",
                                ...mentionAll
                            };
                            break;
                    }

                    if (content) {
                        return await conn.sendMessage(from, content, { quoted: fakevCard });
                    }
                } catch (e) {
                    console.error("Media download/send error:", e);
                    return reply("❌ *Failed to process the media.*");
                }
            }

            return await conn.sendMessage(from, {
                text: m.quoted.text || "📨 Message",
                ...mentionAll
            }, { quoted: fakevCard });
        }

        // If no quoted message, but a direct message is sent
        if (q) {
            if (isUrl(q)) {
                return await conn.sendMessage(from, {
                    text: q,
                    ...mentionAll
                }, { quoted: fakevCard });
            }

            await conn.sendMessage(from, {
                text: q, 
                ...mentionAll
            }, { quoted: fakevCard });
        }

    } catch (e) {
        console.error(e);
        reply(`❌ *Error Occurred !!*`);
    }
});
// ==================== SIMPLE ADMIN CHECK COMMAND ====================
cmd({
    pattern: "admincheck",
    alias: ["checkadmin", "admintest"],
    desc: "Check admin status",
    category: "group",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, {
    from, isGroup, reply, sender, isCreator, participants
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command only works in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");

        let message = `👑 *SANA MD MINI BOT - ADMIN CHECK* 👑\n\n`;  
        message += `👤 *You:* @${sender.split('@')[0]}\n`;  
        message += `🤖 *Bot Owner Check:* ${isCreator ? '✅ YES (Owner)' : '❌ NO'}\n\n`;  
          
        // Try to check bot admin status  
        try {  
            const groupMetadata = await conn.groupMetadata(from);  
            const botParticipant = groupMetadata.participants.find(p => p.id === conn.user.id);  
            const isBotAdmin = botParticipant ? botParticipant.admin : false;  
              
            message += `🤖 *Bot Admin Status:* ${isBotAdmin ? '✅ YES' : '❌ NO'}\n`;  
            message += `👥 *Total Members:* ${groupMetadata.participants.length}\n\n`;  
              
            if (!isBotAdmin) {  
                message += `⚠️ *Bot is not admin!*\n(බොට් සමූහයේ Admin කෙනෙක් නොවේ!)\nUse: *.botadmin* to promote manually.`;  
            } else {  
                message += `✅ *Bot is admin!*\n(බොට් දැනටමත් Admin බලතල ලබා ඇත!)\n\nAvailable tools:\n• .promote @user\n• .demote @admin\n• .kick @user\n• .add @user`;  
            }  
        } catch (metadataError) {  
            message += `❌ *Cannot fetch group details.*\n(සමූහයේ තොරතුරු ලබා ගත නොහැක.)\n\nPlease make bot admin first using: *.botadmin*`;  
        }  
          
        await conn.sendMessage(from, {  
            text: message,  
            mentions: [sender]  
        }, { quoted: mek });

    } catch (err) {
        console.error("Admin Check Error:", err);
        reply("❌ *Error in admincheck command.*");
    }
});

//============== Group Kick All (End Command) ==============
cmd({
    pattern: "end",
    alias: ["byeall", "kickall2", "endgc"],
    desc: "Removes all members from the group except specified numbers",
    category: "admin",
    react: "⚠️",
    filename: __filename
},
async (conn, mek, m, {
    from, isGroup, isBotAdmins, reply, groupMetadata, isCreator
}) => {
    if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
    if (!isCreator) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *Only the owner (SANA MD) can use this command.*\n(මෙය භාවිතා කිරීමට බොට් අයිතිකරුට පමණක් අවසර ඇත.)");
    if (!isBotAdmins) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❌ *I need to be admin to use this command.*\n(මෙය සිදු කිරීමට මට Admin බලතල අවශ්‍ය වේ.)");

    try {
        // Ignored numbers (Your Sri Lankan Number & Bot itself)
        const botOwnerNumber = "94770740571@s.whatsapp.net";
        const botJid = conn.user.id.includes(':') ? conn.user.id.split(':')[0] + "@s.whatsapp.net" : conn.user.id;
        
        const ignoreJids = [botOwnerNumber, botJid];
        const participants = groupMetadata.participants || [];

        // Filter out ignored JIDs (Owner and Bot)
        const targets = participants.filter(p => !ignoreJids.includes(p.id));
        const jids = targets.map(p => p.id);

        if (jids.length === 0) return reply("✨ *SANA MD MINI BOT* ✨\n\n✅ *No members to remove. Everyone is excluded!*\n(ඉවත් කිරීමට සාමාජිකයන් කිසිවෙකු නොමැත.)");

        await reply(`⚠️ *SANA MD MINI BOT* ⚠️\n\n⚙️ *Removing ${jids.length} members from the group...*\n(සාමාජිකයන් ${jids.length} දෙනා ඉවත් කිරීම ආරම්භ කළා...)`);

        for (let user of jids) {
            try {
                await conn.groupParticipantsUpdate(from, [user], "remove");
                await sleep(1500); // 1.5 seconds delay to prevent number ban
            } catch (kickErr) {
                console.error(`Failed to kick ${user}:`, kickErr);
            }
        }

        reply(`✨ *SANA MD MINI BOT* ✨\n\n✅ *Successfully removed all members from the group!*`);
    } catch (error) {
        console.error("End command error:", error);
        reply("❌ *Failed to remove members.*");
    }
});

//============= leave command ==========
cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "🎉",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, isGroup, isCreator, reply
}) => {
    try {
        if (!isGroup) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❗ *This command can only be used in groups.*\n(මේ Command එක Groups වල පමණක් භාවිතා කළ හැක.)");
        if (!isCreator) return reply("⚠️ *SANA MD MINI BOT* ⚠️\n\n❗ *Only the owner (SANA MD) can use this command.*\n(මෙය භාවිතා කිරීමට බොට් අයිතිකරුට පමණක් අවසර ඇත.)");

        // Send a goodbye message first
        await reply(`👋 *Goodbye everyone from SANA MD MINI BOT!*  \n\nI am leaving the group now on my owner's request. Thanks for having me here! ❤️\n\n*(මම සමූහයෙන් ඉවත් වෙනවා. හැමෝටම සුභ දවසක්!)*`);

        await sleep(1500); // Wait a bit before leaving
        await conn.groupLeave(from);

    } catch (e) {
        console.error(e);
        reply(`❌ *Error leaving group.*`);
    }
});

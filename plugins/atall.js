const { cmd } = require("../arslan");

// Global memory
global.atallSettings = global.atallSettings || {};

cmd({
    pattern: "atall",
    react: "⚙️",
    desc: "Control @all permission",
    category: "group",
    use: ".atall on/off/admin",
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

        if (!isGroup) {
            return reply("❌ *This command only works in groups!*");
        }

        if (!isAdmins && !isOwner) {
            return reply("❌ *Only group admins can change @all settings!*");
        }

        const mode = (args[0] || "").toLowerCase();

        if (!["on", "off", "admin"].includes(mode)) {
            return reply(
`📢 *ATALL SETTINGS*

Usage:
.atall on
➜ Everyone can use @all

.atall admin
➜ Only admins can use @all

.atall off
➜ Disable @all for members`
            );
        }

        global.atallSettings[from] = mode;

        let msg = "";

        if (mode === "on") {
            msg = "✅ *@all Enabled*\n\nEveryone can now use @all.";
        }

        if (mode === "admin") {
            msg = "👑 *@all Admin Mode Enabled*\n\nOnly group admins can use @all.";
        }

        if (mode === "off") {
            msg = "❌ *@all Disabled*\n\nOnly admins/owner can use @all.";
        }

        return reply(msg);

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});

// ==========================================
//   SANA MD MINI BOT - COMMAND HANDLER CORE
// ==========================================

var commands = [];

/**
 * Register a new bot command
 * @param {Object} info - Command configuration details
 * @param {Function} func - The execution logic for the command
 */
function cmd(info, func) {
    var data = info;
    data.function = func;
    
    // Pattern එකක් නොමැති නම් cmdname එක භාවිතා කරයි
    if (!data.pattern && data.cmdname) data.pattern = data.cmdname;
    
    // Default variables ආරක්ෂිතව සැකසීම
    if (!data.alias) data.alias = [];
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!data.desc) data.desc = 'SANA MD MINI BOT Command';
    if (!data.fromMe) data.fromMe = false;
    if (!data.category) data.category = 'misc';
    
    // විධාන ලැයිස්තුවට එකතු කිරීම
    commands.push(data);
    return data;
}

module.exports = {
    cmd,
    AddCommand: cmd,
    Function: cmd,
    commands,
};

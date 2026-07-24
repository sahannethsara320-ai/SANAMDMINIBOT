// ═══════════════════════════════════════════════════════════════════════════
//                    SANA MD MINI BOT - COMMAND HANDLER
// ═══════════════════════════════════════════════════════════════════════════

var commands = [];

/**
 * @description Register a new command for the bot
 * @param {Object} info - Command information
 * @param {Function} func - Command function
 * @returns {Object} Command data
 */
function cmd(info, func) {
    var data = info;
    data.function = func;
    
    // Si pas de pattern, on utilise cmdname
    // If no pattern, use cmdname | pattern එක නැත්නම් cmdname එක use කරන්න
    if (!data.pattern && data.cmdname) data.pattern = data.cmdname;
    
    // Default values | Default අගයන්
    if (!data.alias) data.alias = [];
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!data.desc) data.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!data.category) data.category = 'misc';
    
    commands.push(data);
    
    // Log command registration | Command එක register වුණා
    console.log(`📥 [SANA-MD] Command registered: ${data.pattern || data.cmdname || 'unknown'}`);
    
    return data;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS - එකතු කිරීම්
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
    cmd,                    // Main command function
    AddCommand: cmd,         // Alternative name
    Function: cmd,           // Alternative name
    commands,               // All registered commands array
};

// ═══════════════════════════════════════════════════════════════════════════
//  🗄️ SANA MD MINI BOT - DATABASE (AUTO CLEAR EDITION)
// ═══════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const config = require('../config');

// ═══════════════════════════════════════════════════════════════════════
//  🔌 CONNECT DATABASE
// ═══════════════════════════════════════════════════════════════════════

const connectdb = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(config.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Database Connected');
    } catch (e) {
        console.error('❌ Database Error:', e.message);
    }
};

// ═══════════════════════════════════════════════════════════════════════
//  📊 SCHEMAS
// ═══════════════════════════════════════════════════════════════════════

const sessionSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    credentials: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});

const activeNumberSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    lastConnected: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

// ═══════════════════════════════════════════════════════════════════════
//  📦 MODELS
// ═══════════════════════════════════════════════════════════════════════

const Session = mongoose.model('Session', sessionSchema);
const ActiveNumber = mongoose.model('ActiveNumber', activeNumberSchema);

// ═══════════════════════════════════════════════════════════════════════
//  🔧 SESSION FUNCTIONS (WITH AUTO CLEAR)
// ═══════════════════════════════════════════════════════════════════════

// ✅ NEW: Force clear session before creating new
async function clearSessionForNewPairing(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        
        // Delete from database
        await Session.deleteOne({ number: cleanNumber });
        await ActiveNumber.deleteOne({ number: cleanNumber });
        
        console.log(`🗑️ Old session cleared for ${cleanNumber}`);
        return true;
    } catch (error) {
        console.error('❌ Error clearing session:', error);
        return false;
    }
}

async function saveSessionToMongoDB(number, credentials) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await Session.findOneAndUpdate(
            { number: cleanNumber },
            { credentials, updatedAt: new Date() },
            { upsert: true }
        );
        return true;
    } catch (error) {
        console.error('Save session error:', error);
        return false;
    }
}

async function getSessionFromMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        const session = await Session.findOne({ number: cleanNumber });
        return session ? session.credentials : null;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

async function deleteSessionFromMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await Session.deleteOne({ number: cleanNumber });
        await ActiveNumber.deleteOne({ number: cleanNumber });
        console.log(`🗑️ Session deleted for ${cleanNumber}`);
        return true;
    } catch (error) {
        console.error('Delete session error:', error);
        return false;
    }
}

async function addNumberToMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await ActiveNumber.findOneAndUpdate(
            { number: cleanNumber },
            { lastConnected: new Date(), isActive: true },
            { upsert: true }
        );
        return true;
    } catch (error) {
        console.error('Add number error:', error);
        return false;
    }
}

async function removeNumberFromMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await ActiveNumber.deleteOne({ number: cleanNumber });
        return true;
    } catch (error) {
        console.error('Remove number error:', error);
        return false;
    }
}

async function getAllNumbersFromMongoDB() {
    try {
        const activeNumbers = await ActiveNumber.find({ isActive: true });
        return activeNumbers.map(num => num.number);
    } catch (error) {
        console.error('Get numbers error:', error);
        return [];
    }
}

// Dummy functions for compatibility
async function getUserConfigFromMongoDB(number) {
    return {
        AUTO_RECORDING: 'false',
        AUTO_TYPING: 'false',
        ANTI_CALL: 'false',
        READ_MESSAGE: 'false',
        AUTO_VIEW_STATUS: 'true',
        AUTO_LIKE_STATUS: 'true'
    };
}

async function updateUserConfigInMongoDB(number, config) { return true; }
async function saveOTPToMongoDB(number, otp, config) { return true; }
async function verifyOTPFromMongoDB(number, otp) { return { valid: true, config: {} }; }
async function incrementStats(number, field) { return true; }
async function getStatsForNumber(number) { return []; }

async function getGlobalStats() {
    try {
        const activeUsers = await ActiveNumber.countDocuments({ isActive: true });
        const totalPairs = await Session.countDocuments();
        return { 
            totalPairs: totalPairs, 
            activeUsers: activeUsers, 
            totalCommands: 0, 
            uptime: '0h' 
        };
    } catch (error) {
        return { totalPairs: 0, activeUsers: 0, totalCommands: 0, uptime: '0h' };
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  📦 EXPORTS
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
    connectdb,
    Session,
    ActiveNumber,
    clearSessionForNewPairing,  // ✅ NEW FUNCTION
    saveSessionToMongoDB,
    getSessionFromMongoDB,
    deleteSessionFromMongoDB,
    addNumberToMongoDB,
    removeNumberFromMongoDB,
    getAllNumbersFromMongoDB,
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB,
    saveOTPToMongoDB,
    verifyOTPFromMongoDB,
    incrementStats,
    getStatsForNumber,
    getGlobalStats
};

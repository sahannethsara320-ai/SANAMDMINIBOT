// ═══════════════════════════════════════════════════════════════════════════
//  🌐 SANA MD MINI BOT - SERVER LIB (AUTO CLEAR + REAL-TIME)
// ═══════════════════════════════════════════════════════════════════════════

const express = require('express');
const path = require('path');
const cors = require('cors');
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const { 
    connectdb, 
    clearSessionForNewPairing,
    saveSessionToMongoDB, 
    getSessionFromMongoDB, 
    addNumberToMongoDB, 
    removeNumberFromMongoDB, 
    getAllNumbersFromMongoDB,
    getGlobalStats 
} = require('./database');

// Express app setup
const app = express();
const PORT = process.env.PORT || 8000; // Server පෝර්ට් එක

// Middleware setup
app.use(cors());
app.use(express.json());

// Serve the HTML file (make sure pair.html is in the root or a public folder)
// Note: If pair.html is in root, update path accordingly
app.use(express.static(path.join(__dirname, '..'))); 

// Connect to database
connectdb();

// In-memory store for active connections (Real-time stats)
const activeConnections = new Map();

// Server start time for uptime calculation
const startTime = Date.now();

// Serve the pair.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pair.html'));
});

// Stats endpoint for pair.html
app.get('/stats', async (req, res) => {
    try {
        const dbStats = await getGlobalStats();
        const hours = Math.floor((Date.now() - startTime) / (1000 * 60 * 60));
        const uptime = `${hours}h`;
        const activeUsers = activeConnections.size;
        
        res.json({
            activeUsers: activeUsers,
            totalPairs: dbStats.totalPairs || 0, // Ensure it's a number
            uptime: uptime
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.json({
            activeUsers: 0,
            totalPairs: 0,
            uptime: '0h'
        });
    }
});

// Code generation endpoint
app.get('/code', async (req, res) => {
    const { number } = req.query;
    
    if (!number || number.length < 10) {
        return res.status(400).json({ code: 'ERROR', message: 'Invalid phone number' });
    }
    
    try {
        const cleanNumber = number.replace(/[-9]/g, '');
        
        // Clear old session before creating new one
        await clearSessionForNewPairing(cleanNumber);
        
        // Ensure session directory exists
        const sessionDir = `./sessions/${cleanNumber}`;
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }
        
        // Initialize auth state
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        // Create socket
        const socket = makeWASocket({
            version: (await fetchLatestBaileysVersion()).version,
            auth: state,
            printQRInTerminal: false // No QR in terminal, only pairing code
        });
        
        // Connection update handler
        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== 401;
                
                // If 401 error, session expired or wrong credentials
                if (!shouldReconnect) {
                    activeConnections.delete(cleanNumber);
                    await removeNumberFromMongoDB(cleanNumber);
                    console.log(`Session cleared for ${cleanNumber} (401 error)`);
                }
            } else if (connection === 'open') {
                console.log(`✅ Connection OPEN for ${cleanNumber}`);
                activeConnections.set(cleanNumber, socket);
                await addNumberToMongoDB(cleanNumber);
                await saveSessionToMongoDB(cleanNumber, state);
            }
        });
        
        // Save credentials on update
        socket.ev.on('creds.update', saveCreds);
        
        // Request and return pairing code
        try {
            const pairingCode = await socket.requestPairingCode(cleanNumber);
            console.log(`🔐 Pairing Code Generated for ${cleanNumber}: ${pairingCode}`);
            res.json({ code: pairingCode });
        } catch (pairError) {
            console.error('Pairing code error:', pairError);
            res.status(500).json({ code: 'ERROR', message: 'Failed to generate code' });
        }
        
    } catch (error) {
        console.error('Code generation error:', error);
        res.status(500).json({ code: 'ERROR', message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SANA MD MINI BOT Server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down server...');
    for (const [number, socket] of activeConnections) {
        socket.ws.close();
    }
    process.exit(0);
});

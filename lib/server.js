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
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to database
connectdb();

// In-memory store for active connections
const activeConnections = new Map();

// Server start time for uptime calculation
const startTime = Date.now();

// Serve the HTML interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

// Stats endpoint
app.get('/stats', async (req, res) => {
    try {
        // Get stats from database
        const dbStats = await getGlobalStats();
        
        // Calculate uptime
        const hours = Math.floor((Date.now() - startTime) / (1000 * 60 * 60));
        const uptime = `${hours}h`;
        
        // Get active connections count
        const activeUsers = activeConnections.size;
        
        // Return response
        res.json({
            activeUsers: activeUsers,
            totalPairs: dbStats.totalPairs,
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
        return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    try {
        // Clean the number
        const cleanNumber = number.replace(/[-9]/g, '');
        
        // Check if already connected
        if (activeConnections.has(cleanNumber)) {
            return res.status(400).json({ error: 'Already connected' });
        }
        
        // Clear any existing session for this number
        await clearSessionForNewPairing(cleanNumber);
        
        // Create session directory if it doesn't exist
        const sessionDir = `./sessions/${cleanNumber}`;
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }
        
        // Create auth state
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        // Create socket connection
        const socket = makeWASocket({
            version: (await fetchLatestBaileysVersion()).version,
            auth: state,
            printQRInTerminal: false
        });
        
        // Handle connection updates
        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== 401;
                console.log(`Connection closed for ${cleanNumber}, should reconnect: ${shouldReconnect}`);
                
                // Remove from active connections
                activeConnections.delete(cleanNumber);
                await removeNumberFromMongoDB(cleanNumber);
            } else if (connection === 'open') {
                console.log(`Connection opened for ${cleanNumber}`);
                
                // Add to active connections
                activeConnections.set(cleanNumber, socket);
                await addNumberToMongoDB(cleanNumber);
                
                // Save session to database
                await saveSessionToMongoDB(cleanNumber, state);
            }
        });
        
        // Handle credentials update
        socket.ev.on('creds.update', saveCreds);
        
        // Request pairing code
        try {
            const pairingCode = await socket.requestPairingCode(cleanNumber);
            res.json({ code: pairingCode });
        } catch (error) {
            console.error('Error requesting pairing code:', error);
            res.status(500).json({ error: 'Failed to generate pairing code' });
        }
        
    } catch (error) {
        console.error('Error generating pairing code:', error);
        res.status(500).json({ error: 'Failed to generate pairing code' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    
    // Close all active connections
    for (const [number, socket] of activeConnections) {
        socket.ws.close();
    }
    
    process.exit(0);
});

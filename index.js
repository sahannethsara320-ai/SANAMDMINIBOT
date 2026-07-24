// ==========================================
//    SANA MD MINI BOT - CORE WEB SERVER
// ==========================================

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware configurations
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing for the Pair Code generator
const pairRouter = require('./main');
app.use('/', pairRouter);

// Start the Express Server
app.listen(port, () => {
    console.log(`==========================================`);
    console.log(`✨ SANA MD MINI BOT SERVER IS ACTIVE ✨`);
    console.log(`🚀 Server is running smoothly on port: ${port}`);
    console.log(`==========================================`);
});

module.exports = app;

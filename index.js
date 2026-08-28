// ==========================================
//    SANA MD MINI BOT - CORE WEB SERVER
// ==========================================

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Environment PORT or default 8000
const port = process.env.PORT || 8000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================================
// PAIR CODE ROUTER
// ==========================================

const pairRouter = require("./main");

app.use("/", pairRouter);

// ==========================================
// START SERVER
// ==========================================

app.listen(port, () => {
    console.log("==========================================");
    console.log("✨ SANA MD MINI BOT SERVER IS ACTIVE ✨");
    console.log(`🚀 Server is running smoothly on port: ${port}`);
    console.log("🤖 NEOXR AI API ENV Loaded");
    console.log("==========================================");
});

module.exports = app;

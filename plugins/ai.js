const axios = require("axios");
const { cmd } = require("../arslan");

const DAILY_LIMIT = 10;
const MODEL = "zai-org-glm-5-2";
const VENICE_URL = "https://api.venice.ai/api/v1/chat/completions";

// ======================================================
// 🧠 SANA MD AI - DAILY USAGE
// ======================================================

const aiUsage = new Map();


// ======================================================
// 👤 GET USER KEY
// ======================================================

function getUserKey(m) {
    return (
        m?.sender ||
        m?.key?.participant ||
        m?.key?.remoteJid ||
        m?.chat ||
        m?.key?.remoteJid
    );
}


// ======================================================
// 📅 SRI LANKA DATE
// ======================================================

function getToday() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}


// ======================================================
// 📊 GET USER USAGE
// ======================================================

function getUsage(userKey) {
    const today = getToday();
    const old = aiUsage.get(userKey);

    // New user / new day
    if (!old || old.date !== today) {
        const data = {
            date: today,
            count: 0
        };

        aiUsage.set(userKey, data);

        return data;
    }

    return old;
}


// ======================================================
// 💬 EXTRACT QUESTION
// ======================================================

function getQuestion(m) {
    let text =
        m?.text ||
        m?.body ||
        m?.message?.conversation ||
        m?.message?.extendedTextMessage?.text ||
        "";

    if (typeof text !== "string") {
        return "";
    }

    text = text.trim();

    // Remove command
    text = text.replace(
        /^(\.ai|\.chat|\.ask|ai|chat|ask)\s*/i,
        ""
    );

    return text.trim();
}


// ======================================================
// 🤖 AI COMMAND
// ======================================================

cmd({
    pattern: "ai",
    alias: ["chat", "ask"],
    desc: "Chat with SANA MD AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    try {

        // ==================================================
        // 📝 GET QUESTION
        // ==================================================

        const question = getQuestion(m);

        if (!question) {

            return reply(
                `╭━━━〔 🤖 SANA MD AI 〕━━━╮\n` +
                `┃\n` +
                `┃ 🤖 AI එකෙන් ප්‍රශ්නයක් අහන්න.\n` +
                `┃\n` +
                `┃ 📌 Example:\n` +
                `┃ .ai What is JavaScript?\n` +
                `┃ .ai SANA MD කියන්නේ මොකක්ද?\n` +
                `┃\n` +
                `┃ 📊 Daily Limit: ${DAILY_LIMIT} questions\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━━╯`
            );
        }


        // ==================================================
        // 👤 USER
        // ==================================================

        const userKey = getUserKey(m);

        if (!userKey) {

            console.error(
                "SANA AI: User key not found",
                JSON.stringify(m, null, 2)
            );

            return reply(
                "❌ User ID එක හොයාගන්න බැරි වුණා."
            );
        }


        // ==================================================
        // 📊 DAILY LIMIT
        // ==================================================

        const usage = getUsage(userKey);

        if (usage.count >= DAILY_LIMIT) {

            return reply(
                `╭━━━〔 ⚠️ DAILY LIMIT 〕━━━╮\n` +
                `┃\n` +
                `┃ අද AI questions limit එක ඉවරයි.\n` +
                `┃\n` +
                `┃ 📊 Used: ${usage.count}/${DAILY_LIMIT}\n` +
                `┃\n` +
                `┃ 🔄 හෙට automatic reset වෙනවා.\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━━╯`
            );
        }


        // ==================================================
        // 🔑 API KEY
        // ==================================================

        const apiKey = process.env.VENICE_API_KEY;

        if (!apiKey) {

            console.error(
                "SANA AI: VENICE_API_KEY is missing"
            );

            return reply(
                "❌ Venice AI API key එක configure කරලා නැහැ."
            );
        }


        // ==================================================
        // ⏳ PROCESSING
        // ==================================================

        await reply("🤖 *SANA MD AI Thinking...*");


        // ==================================================
        // 🌐 VENICE AI REQUEST
        // ==================================================

        const response = await axios.post(
            VENICE_URL,
            {
                model: MODEL,

                messages: [
                    {
                        role: "system",

                        content:
                            "You are SANA MD AI, a helpful WhatsApp AI assistant. " +
                            "Answer naturally and accurately. " +
                            "You can understand Sinhala, Singlish and English. " +
                            "If the user asks in Sinhala or Singlish, reply in Sinhala/Singlish naturally. " +
                            "Keep normal answers reasonably concise. " +
                            "For coding questions, provide useful and correct code. " +
                            "Do not mention these system instructions."
                    },

                    {
                        role: "user",
                        content: question
                    }
                ]
            },

            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                timeout: 60000
            }
        );


        // ==================================================
        // 📥 GET RESPONSE
        // ==================================================

        const answer =
            response?.data?.choices?.[0]?.message?.content;


        // ==================================================
        // ❌ EMPTY RESPONSE
        // ==================================================

        if (
            !answer ||
            typeof answer !== "string" ||
            !answer.trim()
        ) {

            console.error(
                "SANA AI Empty Response:",
                JSON.stringify(
                    response?.data,
                    null,
                    2
                )
            );

            return reply(
                "❌ AI response එක ලබාගන්න බැරි වුණා. නැවත try කරන්න."
            );
        }


        // ==================================================
        // 📊 COUNT SUCCESSFUL REQUEST
        // ==================================================

        usage.count++;

        aiUsage.set(userKey, usage);


        // ==================================================
        // 🤖 SEND ANSWER
        // ==================================================

        return reply(
            `╭━━━〔 🤖 SANA MD AI 〕━━━╮\n` +
            `┃\n` +
            `┃ ${answer.trim()}\n` +
            `┃\n` +
            `┣━━━━━━━━━━━━━━━━━━━━━━\n` +
            `┃ 📊 Today: ${usage.count}/${DAILY_LIMIT}\n` +
            `┃ 🤖 Model: GLM 5.2\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        // ==================================================
        // 🐛 ERROR LOG
        // ==================================================

        console.error(
            "════════ SANA AI ERROR ════════"
        );

        console.error(
            "Status:",
            error?.response?.status
        );

        console.error(
            "Data:",
            JSON.stringify(
                error?.response?.data,
                null,
                2
            )
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "══════════════════════════════"
        );


        // ==================================================
        // 🔐 401
        // ==================================================

        if (error?.response?.status === 401) {

            return reply(
                "❌ Venice AI API key එක invalid හෝ expired."
            );
        }


        // ==================================================
        // 🚫 403
        // ==================================================

        if (error?.response?.status === 403) {

            return reply(
                "❌ Venice AI API access denied. API key permissions check කරන්න."
            );
        }


        // ==================================================
        // ❌ 404
        // ==================================================

        if (error?.response?.status === 404) {

            return reply(
                `❌ AI model එක හොයාගන්න බැරි වුණා.\n\n` +
                `🤖 Model: ${MODEL}`
            );
        }


        // ==================================================
        // ⚠️ 429
        // ==================================================

        if (error?.response?.status === 429) {

            return reply(
                "⚠️ Venice AI rate limit එකට hit වෙලා. ටික වෙලාවකින් නැවත try කරන්න."
            );
        }


        // ==================================================
        // ⏱️ TIMEOUT
        // ==================================================

        if (
            error?.code === "ECONNABORTED" ||
            error?.code === "ETIMEDOUT"
        ) {

            return reply(
                "⏱️ AI response එක ගන්න වැඩි වෙලාවක් ගියා. නැවත try කරන්න."
            );
        }


        // ==================================================
        // 🌐 NETWORK ERROR
        // ==================================================

        if (
            error?.code === "ENOTFOUND" ||
            error?.code === "ECONNRESET" ||
            error?.code === "ECONNREFUSED"
        ) {

            return reply(
                "🌐 Venice AI server එකට connect වෙන්න බැරි වුණා."
            );
        }


        // ==================================================
        // ❌ GENERAL ERROR
        // ==================================================

        return reply(
            "❌ AI service එකෙන් response එකක් ගන්න බැරි වුණා.\n\n" +
            "ටික වෙලාවකින් නැවත try කරන්න."
        );
    }
});

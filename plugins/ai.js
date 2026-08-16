const axios = require("axios");
const { cmd } = require("../arslan");

const DAILY_LIMIT = 10;

// User daily usage memory
const aiUsage = new Map();

function getUserKey(m) {
    return m?.sender || m?.key?.participant || m?.key?.remoteJid;
}

function getToday() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;
}

function getUsage(userKey) {
    const today = getToday();
    const old = aiUsage.get(userKey);

    // New day → reset
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

cmd({
    pattern: "ai",
    alias: ["chat", "ask"],
    desc: "Chat with SANA MD AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    try {
        // ==========================
        // CHECK MESSAGE
        // ==========================

        const question = m?.text?.trim();

        if (!question) {
            return reply(
                `🤖 *SANA MD AI*\n\n` +
                `AI එකෙන් ප්‍රශ්නයක් අහන්න.\n\n` +
                `📌 Example:\n` +
                `.ai What is JavaScript?\n\n` +
                `📊 Daily Limit: ${DAILY_LIMIT} questions`
            );
        }

        // ==========================
        // USER
        // ==========================

        const userKey = getUserKey(m);

        if (!userKey) {
            return reply("❌ User ID එක හොයාගන්න බැරි වුණා.");
        }

        // ==========================
        // DAILY LIMIT
        // ==========================

        const usage = getUsage(userKey);

        if (usage.count >= DAILY_LIMIT) {
            return reply(
                `⚠️ *Daily AI Limit Reached!*\n\n` +
                `ඔයා අද ප්‍රශ්න ${DAILY_LIMIT}ක් භාවිතා කරලා තියෙනවා.\n\n` +
                `🔄 හෙට limit එක automatic reset වෙනවා.\n` +
                `📊 Used: ${usage.count}/${DAILY_LIMIT}`
            );
        }

        // ==========================
        // API KEY
        // ==========================

        const apiKey = process.env.VENICE_API_KEY;

        if (!apiKey) {
            console.error("VENICE_API_KEY is missing.");

            return reply(
                "❌ Venice AI API key එක configure කරලා නැහැ."
            );
        }

        // ==========================
        // PROCESSING
        // ==========================

        await reply("🤖 *Thinking...*");

        // ==========================
        // VENICE AI REQUEST
        // ==========================

        const response = await axios.post(
            "https://api.venice.ai/api/v1/chat/completions",
            {
                model: "zai-org-glm-5",

                messages: [
                    {
                        role: "system",
                        content:
                            "You are SANA MD AI, a helpful WhatsApp AI assistant. " +
                            "Answer clearly and naturally. Keep responses reasonably concise."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                timeout: 60000
            }
        );

        // ==========================
        // GET AI RESPONSE
        // ==========================

        const answer =
            response?.data?.choices?.[0]?.message?.content;

        if (!answer) {
            console.error(
                "Venice AI response:",
                JSON.stringify(response.data, null, 2)
            );

            return reply(
                "❌ AI response එක ලබාගන්න බැරි වුණා."
            );
        }

        // ==========================
        // COUNT ONLY SUCCESSFUL QUERY
        // ==========================

        usage.count++;
        aiUsage.set(userKey, usage);

        // ==========================
        // SEND RESPONSE
        // ==========================

        return reply(
            `🤖 *SANA MD AI*\n\n` +
            `${answer}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `📊 *Today:* ${usage.count}/${DAILY_LIMIT}`
        );

    } catch (error) {

        console.error(
            "SANA AI Error:",
            error?.response?.data || error.message
        );

        if (error?.response?.status === 401) {
            return reply(
                "❌ Venice AI API key එක invalid හෝ expired."
            );
        }

        if (error?.response?.status === 429) {
            return reply(
                "⚠️ Venice AI rate limit එකට hit වෙලා. ටික වෙලාවකින් නැවත try කරන්න."
            );
        }

        return reply(
            "❌ AI service එකෙන් response එකක් ගන්න බැරි වුණා. නැවත try කරන්න."
        );
    }
});

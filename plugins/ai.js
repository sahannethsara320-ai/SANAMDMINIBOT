const axios = require("axios");
const { cmd } = require("../arslan");

// ======================================================
// NEOXR AI - API KEY AUTO FALLBACK
// ======================================================

const API_KEYS = [
    process.env.NEOXR_API_KEY_1,
    process.env.NEOXR_API_KEY_2,
    process.env.NEOXR_API_KEY_3
].filter(Boolean);

const BASE_URL = "https://api.neoxr.eu/api";

// ======================================================
// GET AI RESPONSE
// ======================================================

async function getAIResponse(query) {
    let lastError;

    if (!API_KEYS.length) {
        throw new Error("No NEOXR API keys configured");
    }

    for (let i = 0; i < API_KEYS.length; i++) {
        const apiKey = API_KEYS[i];

        try {
            console.log(
                `[NEOXR AI] Trying API Key ${i + 1}/${API_KEYS.length}`
            );

            const response = await axios.get(
                `${BASE_URL}/chat`,
                {
                    params: {
                        q: query,
                        apikey: apiKey
                    },
                    timeout: 60000
                }
            );

            const data = response.data;

            console.log(
                `[NEOXR AI] Key ${i + 1} response received`
            );

            console.log("[NEOXR AI] Response:", data);

            const answer =
                data?.result ||
                data?.data?.result ||
                data?.data?.message ||
                data?.data?.text ||
                data?.message ||
                data?.answer ||
                data?.response;

            if (
                typeof answer === "string" &&
                answer.trim()
            ) {
                return answer.trim();
            }

            if (
                answer &&
                typeof answer === "object"
            ) {
                if (typeof answer.text === "string") {
                    return answer.text;
                }

                if (typeof answer.message === "string") {
                    return answer.message;
                }

                if (typeof answer.response === "string") {
                    return answer.response;
                }

                if (typeof answer.result === "string") {
                    return answer.result;
                }
            }

            throw new Error(
                "Invalid or empty response from Neoxr API"
            );

        } catch (error) {
            lastError = error;

            console.log(
                `[NEOXR AI] API Key ${i + 1} failed:`,
                error.response?.data || error.message
            );
        }
    }

    throw lastError || new Error(
        "All Neoxr API keys failed"
    );
}


// ======================================================
// AI COMMAND
// ======================================================

cmd(
    {
        pattern: "ai",
        alias: ["gpt", "gemini"],
        desc: "Ask anything from AI",
        category: "ai",
        react: "🤖",
        filename: __filename
    },

    async (
        conn,
        mek,
        m,
        {
            from,
            q,
            args
        }
    ) => {

        try {

            // ==========================================
            // EMPTY QUERY
            // ==========================================

            const query =
                q ||
                args?.join(" ") ||
                "";

            if (!query.trim()) {

                return await conn.sendMessage(
                    from,
                    {
                        text:
                            "❌ *AI එකෙන් අහන්න ප්‍රශ්නයක් දෙන්න!*\n\n" +
                            "*Examples:*\n" +
                            "• .ai Hello\n" +
                            "• .ai JavaScript code එකක් හදන්න\n" +
                            "• .gpt What is Node.js?"
                    },
                    {
                        quoted: mek
                    }
                );
            }


            // ==========================================
            // CALL AI
            // ==========================================

            const answer =
                await getAIResponse(query);


            // ==========================================
            // SEND ANSWER
            // ==========================================

            await conn.sendMessage(
                from,
                {
                    text: `🤖 *AI RESPONSE*\n\n${answer}`
                },
                {
                    quoted: mek
                }
            );

        } catch (error) {

            console.error(
                "[AI COMMAND ERROR]",
                error.response?.data ||
                error.message ||
                error
            );

            await conn.sendMessage(
                from,
                {
                    text:
                        "❌ *AI සේවාව තාවකාලිකව ක්‍රියා නොකරයි.*\n\n" +
                        "කරුණාකර ටික වේලාවකින් නැවත උත්සාහ කරන්න."
                },
                {
                    quoted: mek
                }
            );
        }
    }
);

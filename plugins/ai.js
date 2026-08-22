const axios = require("axios");

// ======================================================
// NEOXR AI - 3 API KEY AUTO FALLBACK
// ======================================================

// Dashboard එකෙන් generate කරපු NEW keys මෙතන දාන්න
const API_KEYS = [
    "lscr8cny1qd5ef3bnkwamp",
    "38o5e71qyvaixmh6rdw0s",
    "d5h45wtalv6f5wk49rmdaj"
];

const BASE_URL = "https://api.neoxr.eu/api";

// ======================================================
// GET AI RESPONSE WITH AUTOMATIC KEY FALLBACK
// ======================================================

async function getAIResponse(query) {
    let lastError;

    // Key 1 fail -> Key 2
    // Key 2 fail -> Key 3
    for (let i = 0; i < API_KEYS.length; i++) {
        const apiKey = API_KEYS[i];

        if (
            !apiKey ||
            apiKey.includes("PUT_YOUR")
        ) {
            continue;
        }

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

            // Different possible response formats
            const answer =
                data?.result ||
                data?.data?.result ||
                data?.data ||
                data?.message ||
                data?.answer ||
                data?.response;

            // Valid answer found
            if (
                answer &&
                typeof answer === "string"
            ) {
                return answer;
            }

            // Sometimes result may be an object
            if (
                answer &&
                typeof answer === "object"
            ) {
                if (answer.text) return answer.text;
                if (answer.message) return answer.message;
                if (answer.response) return answer.response;
            }

            throw new Error(
                "Invalid or empty response from Neoxr API"
            );

        } catch (error) {
            lastError = error;

            console.log(
                `[NEOXR AI] API Key ${i + 1} failed:`,
                error.response?.data ||
                error.message
            );

            // Automatically try next key
            continue;
        }
    }

    throw lastError || new Error(
        "All Neoxr API keys failed"
    );
}


// ======================================================
// AI COMMAND
// ======================================================

async function aiCommand(sock, chatId, message) {

    try {

        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            "";

        if (!text) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
                        "❌ *ප්‍රශ්නයක් ලබා දෙන්න!*\n" +
                        "❌ *Please provide a question!*\n\n" +
                        "*Example:*\n" +
                        ".ai Hello\n" +
                        ".gpt ලංකාව ගැන කියන්න"
                },
                {
                    quoted: message
                }
            );
        }


        // ======================================================
        // COMMAND + QUERY
        // ======================================================

        const parts = text.trim().split(/\s+/);

        const command =
            parts[0].toLowerCase();

        const query =
            parts.slice(1).join(" ").trim();


        // ======================================================
        // EMPTY QUERY
        // ======================================================

        if (!query) {

            return await sock.sendMessage(
                chatId,
                {
                    text:
                        "❌ *AI එකෙන් අහන්න ප්‍රශ්නයක් දෙන්න!*\n" +
                        "❌ *Please provide a question for AI!*\n\n" +
                        "*Examples:*\n" +
                        "• .ai Hello\n" +
                        "• .ai JavaScript code එකක් හදන්න\n" +
                        "• .gpt What is Node.js?"
                },
                {
                    quoted: message
                }
            );
        }


        // ======================================================
        // SUPPORTED COMMANDS
        // ======================================================

        const supportedCommands = [
            ".ai",
            ".gpt",
            ".gemini"
        ];

        if (!supportedCommands.includes(command)) {
            return;
        }


        // ======================================================
        // PROCESSING REACTION
        // ======================================================

        await sock.sendMessage(
            chatId,
            {
                react: {
                    text: "🤖",
                    key: message.key
                }
            }
        );


        // ======================================================
        // CALL AI
        // ======================================================

        const answer =
            await getAIResponse(query);


        // ======================================================
        // SEND RESPONSE
        // ======================================================

        await sock.sendMessage(
            chatId,
            {
                text: answer
            },
            {
                quoted: message
            }
        );


        // ======================================================
        // SUCCESS REACTION
        // ======================================================

        await sock.sendMessage(
            chatId,
            {
                react: {
                    text: "✅",
                    key: message.key
                }
            }
        );


    } catch (error) {

        console.error(
            "[AI COMMAND ERROR]",
            error.response?.data ||
            error.message ||
            error
        );


        // Error reaction
        await sock.sendMessage(
            chatId,
            {
                react: {
                    text: "❌",
                    key: message.key
                }
            }
        );


        // Sinhala + English error
        await sock.sendMessage(
            chatId,
            {
                text:
                    "❌ *AI සේවාව තාවකාලිකව ක්‍රියා නොකරයි.*\n" +
                    "❌ *The AI service is temporarily unavailable.*\n\n" +
                    "කරුණාකර ටික වේලාවකින් නැවත උත්සාහ කරන්න.\n" +
                    "Please try again in a moment."
            },
            {
                quoted: message
            }
        );
    }
}

module.exports = aiCommand;

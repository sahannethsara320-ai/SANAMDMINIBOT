const axios = require("axios");
const { cmd } = require("../arslan");

// ═══════════════════════════════════════
// 🤖 SANA MD MINI BOT - MULTI AI PLUGIN
// ═══════════════════════════════════════

const AI_APIS = [
    {
        name: "ZELL AI",
        url: (query) =>
            `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`,
        type: "axios"
    },

    {
        name: "VAPIS Gemini",
        url: (query) =>
            `https://vapis.my.id/api/gemini?q=${encodeURIComponent(query)}`,
        type: "axios"
    },

    {
        name: "Gemini Pro",
        url: (query) =>
            `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`,
        type: "axios"
    },

    {
        name: "Ryzendesu Gemini",
        url: (query) =>
            `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}`,
        type: "axios"
    },

    {
        name: "Gifted Gemini AI",
        url: (query) =>
            `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(query)}`,
        type: "axios"
    },

    {
        name: "Gifted Gemini Pro",
        url: (query) =>
            `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(query)}`,
        type: "axios"
    }
];


// ═══════════════════════════════════════
// 📥 GET AI RESPONSE
// ═══════════════════════════════════════

async function getAIResponse(query) {

    for (const api of AI_APIS) {

        try {

            console.log(`Trying AI: ${api.name}`);

            const response = await axios.get(
                api.url(query),
                {
                    timeout: 20000
                }
            );

            const data = response.data;

            // Different API response formats
            let answer =
                data?.result ||
                data?.answer ||
                data?.message ||
                data?.data ||
                data?.response ||
                data?.text;

            // If answer is object
            if (typeof answer === "object" && answer !== null) {

                answer =
                    answer.text ||
                    answer.message ||
                    answer.answer ||
                    answer.result ||
                    JSON.stringify(answer);
            }

            if (
                answer &&
                typeof answer === "string" &&
                answer.trim().length > 0
            ) {

                console.log(`AI Success: ${api.name}`);

                return {
                    answer: answer.trim(),
                    provider: api.name
                };
            }

        } catch (error) {

            console.log(
                `AI Failed: ${api.name} → ${error.message}`
            );

            // Fail → automatically try next API
            continue;
        }
    }

    throw new Error("All AI APIs failed");
}


// ═══════════════════════════════════════
// 🧠 CREATE PROMPTS
// ═══════════════════════════════════════

function createPrompt(type, query) {

    switch (type) {

        case "code":

            return `
You are an expert software developer.

Generate clean, complete and working code.

User request:
${query}
`;


        case "fix":

            return `
You are an expert programmer.

Find and fix the error in the following code or problem.

Explain the issue briefly and provide the corrected complete code.

User input:
${query}
`;


        case "translate":

            return `
Translate the following text accurately.

If the user does not specify a language, translate it to Sinhala.

Text:
${query}
`;


        case "summarize":

            return `
Summarize the following content clearly.

Keep the important information.

Content:
${query}
`;


        case "gemini":

            return `
Answer the following question clearly and accurately.

Question:
${query}
`;


        case "gpt":

            return `
Answer the following question helpfully and accurately.

Question:
${query}
`;


        default:

            return query;
    }
}


// ═══════════════════════════════════════
// 🤖 MAIN AI COMMAND
// ═══════════════════════════════════════

cmd(
    {
        pattern: "gpt",
        alias: [
            "gemini",
            "ai",
            "code",
            "fix",
            "translate",
            "summarize"
        ],
        desc: "Multi AI Assistant",
        category: "ai",
        react: "🤖",
        filename: __filename
    },

    async (conn, mek, m, { args, prefix, command }) => {

        try {

            // Get user query
            const query = args.join(" ").trim();


            // ═══════════════════════════════
            // ❌ NO QUERY
            // ═══════════════════════════════

            if (!query) {

                return await conn.sendMessage(
                    m.chat,
                    {
                        text: `
╭━━━〔 🤖 AI COMMANDS 〕━━━⬣
┃
┃ ${prefix}gpt <question>
┃ ${prefix}gemini <question>
┃ ${prefix}ai <question>
┃
┃ ${prefix}code <request>
┃ ${prefix}fix <error/code>
┃ ${prefix}translate <text>
┃ ${prefix}summarize <text>
┃
╰━━━━━━━━━━━━━━━━━━⬣

🤖 Powered by SANA MD MINI BOT
`.trim()
                    },
                    {
                        quoted: mek
                    }
                );
            }


            // ═══════════════════════════════
            // 🤖 PROCESSING REACTION
            // ═══════════════════════════════

            await conn.sendMessage(
                m.chat,
                {
                    react: {
                        text: "🤖",
                        key: mek.key
                    }
                }
            );


            // ═══════════════════════════════
            // 🧠 CREATE AI PROMPT
            // ═══════════════════════════════

            const type = command.toLowerCase();

            const prompt = createPrompt(
                type,
                query
            );


            // ═══════════════════════════════
            // 🌐 GET AI RESPONSE
            // ═══════════════════════════════

            const result = await getAIResponse(
                prompt
            );


            // ═══════════════════════════════
            // 📤 SEND RESPONSE
            // ═══════════════════════════════

            const finalMessage = `
${result.answer}

╭━━━〔 🤖 SANA MD AI 〕━━━⬣
┃ 🧠 AI: ${result.provider}
┃ 🤖 Bot: SANA MD MINI BOT
╰━━━━━━━━━━━━━━━━━━⬣
`.trim();


            await conn.sendMessage(
                m.chat,
                {
                    text: finalMessage
                },
                {
                    quoted: mek
                }
            );


            // ═══════════════════════════════
            // ✅ SUCCESS REACTION
            // ═══════════════════════════════

            await conn.sendMessage(
                m.chat,
                {
                    react: {
                        text: "✅",
                        key: mek.key
                    }
                }
            );

        } catch (error) {

            console.error(
                "SANA MD AI ERROR:",
                error
            );


            await conn.sendMessage(
                m.chat,
                {
                    react: {
                        text: "❌",
                        key: mek.key
                    }
                }
            );


            await conn.sendMessage(
                m.chat,
                {
                    text: `
❌ *AI සේවාව තාවකාලිකව ලබාගත නොහැක.*

කරුණාකර ටික වේලාවකින් නැවත උත්සාහ කරන්න.

🤖 SANA MD MINI BOT
`.trim()
                },
                {
                    quoted: mek
                }
            );
        }
    }
);

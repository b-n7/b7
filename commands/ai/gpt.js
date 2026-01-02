// // // commands/ai/gpt.js
// // import fetch from "node-fetch";

// // export default {
// //   name: "gpt",
// //   alias: ["chatgpt", "wolfgpt"],
// //   desc: "Talk with Silent Wolf's GPT AI 🐺",
// //   category: "AI",
// //   usage: ".gpt <your question>",
// //   async execute(sock, m, args) {
// //     try {
// //       const query = args.join(" ");
// //       if (!query) {
// //         return sock.sendMessage(m.key.remoteJid, {
// //           text: "🐺✨ Silent Wolf says: What do you want me to think about?\n\nUsage: *.gpt Who created you?*"
// //         }, { quoted: m });
// //       }

// //       // Load API Key
// //       const apiKey = process.env.OPENAI_API_KEY;
// //       if (!apiKey) {
// //         return sock.sendMessage(m.key.remoteJid, {
// //           text: "⚠️ Silent Wolf error: No API key found in .env!"
// //         }, { quoted: m });
// //       }

// //       // Call OpenAI
// //       const response = await fetch("https://api.openai.com/v1/responses", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${apiKey}`
// //         },
// //         body: JSON.stringify({
// //           model: "gpt-4o-mini",
// //           input: query
// //         })
// //       });

// //       const data = await response.json();
// //       let reply = data.output?.[0]?.content?.[0]?.text || "⚠️ Silent Wolf could not fetch a reply...";

// //       const wolfReply = `
// // 🌑🌲 *Silent Wolf GPT* 🌲🌑
// // ━━━━━━━━━━━━━━
// // ${reply}
// // ━━━━━━━━━━━━━━
// // 🐺✨ *Silent Wolf at your service* ✨🐺
// // `;

// //       await sock.sendMessage(m.key.remoteJid, { text: wolfReply }, { quoted: m });

// //     } catch (err) {
// //       console.error("GPT Error:", err);
// //       await sock.sendMessage(m.key.remoteJid, {
// //         text: "❌ Silent Wolf stumbled in the forest... try again!"
// //       }, { quoted: m });
// //     }
// //   }
// // };












// // commands/ai/gpt.js
// import fetch from "node-fetch";

// export default {
//   name: "gpt",
//   alias: ["chatgpt", "wolfgpt"],
//   desc: "Talk with Silent Wolf's GPT AI 🐺",
//   category: "AI",
//   usage: ".gpt <your question>",
//   async execute(sock, m, args) {
//     try {
//       const query = args.join(" ");
//       if (!query) {
//         return sock.sendMessage(m.key.remoteJid, {
//           text: "🐺✨ Silent Wolf says: What do you want me to think about?\n\nUsage: *.gpt Who created you?*"
//         }, { quoted: m });
//       }

//       // Load API Key
//       const apiKey = process.env.OPENAI_API_KEY;
//       if (!apiKey) {
//         return sock.sendMessage(m.key.remoteJid, {
//           text: "⚠️ Silent Wolf error: No API key found in .env!"
//         }, { quoted: m });
//       }

//       // Call OpenAI - CORRECTED ENDPOINT
//       const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${apiKey}`
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           messages: [
//             {
//               role: "user",
//               content: query
//             }
//           ],
//           temperature: 0.7,
//           max_tokens: 1000
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
//       }

//       const data = await response.json();
//       let reply = data.choices?.[0]?.message?.content || "⚠️ Silent Wolf could not fetch a reply...";

//       const wolfReply = `
// 🌑🌲 *Silent Wolf GPT* 🌲🌑
// ━━━━━━━━━━━━━━
// ${reply}
// ━━━━━━━━━━━━━━
// 🐺✨ *Silent Wolf at your service* ✨🐺
// `;

//       await sock.sendMessage(m.key.remoteJid, { text: wolfReply }, { quoted: m });

//     } catch (err) {
//       console.error("GPT Error:", err);
//       await sock.sendMessage(m.key.remoteJid, {
//         text: `❌ Silent Wolf stumbled in the forest... ${err.message}`
//       }, { quoted: m });
//     }
//   }
// };










// commands/ai/gpt.js
import fetch from "node-fetch";

export default {
  name: "gpt",
  alias: ["chatgpt", "wolfgpt", "ai"],
  desc: "Talk with Silent Wolf's GPT AI 🐺",
  category: "AI",
  usage: ".gpt <your question>",
  cooldown: 5, // seconds

  async execute(sock, m, args) {
    const jid = m.key.remoteJid;
    const query = args.join(" ");

    try {
      // Check if user provided query
      if (!query) {
        return sock.sendMessage(jid, {
          text: `🌑🌲 *Silent Wolf GPT* 🌲🌑\n\n` +
                `*Usage:* .gpt <your question>\n\n` +
                `*Examples:*\n` +
                `• .gpt What is quantum computing?\n` +
                `• .gpt Write a poem about moonlight\n` +
                `• .gpt Explain blockchain simply\n\n` +
                `🐺✨ *Ask me anything!*`
        }, { quoted: m });
      }

      // Validate query length
      if (query.length > 2000) {
        return sock.sendMessage(jid, {
          text: "❌ *Query too long!*\n\nMaximum 2000 characters allowed."
        }, { quoted: m });
      }

      // Get API key from embedded function
      const apiKey = getOpenAIKey();
      
      if (!apiKey || !apiKey.startsWith('sk-proj')) {
        return sock.sendMessage(jid, {
          text: `⚠️ *API Key Configuration*\n\n` +
                `The OpenAI API key needs to be configured.\n\n` +
                `🔧 *Contact:* Bot administrator`
        }, { quoted: m });
      }

      // Send processing message
      const processingMsg = await sock.sendMessage(jid, {
        text: "🌲 *Silent Wolf is thinking...* 🐺\n\n" +
              "Please wait while I ponder your question..."
      }, { quoted: m });

      // Call OpenAI API
      const result = await callOpenAI(query, apiKey);

      if (!result.success) {
        return sock.sendMessage(jid, {
          text: `❌ *Silent Wolf stumbled...*\n\n` +
                `*Error:* ${result.error}\n\n` +
                `💡 *Troubleshooting:*\n` +
                `• Try rephrasing your question\n` +
                `• Check your internet connection\n` +
                `• Try again in a moment`,
          edit: processingMsg.key
        });
      }

      // Format and send response
      const wolfReply = formatWolfResponse(result.reply, query);

      await sock.sendMessage(jid, {
        text: wolfReply,
        edit: processingMsg.key
      });

      // Optional: Save to history (you can implement this)
      // saveToHistory(jid, query, result.reply);

    } catch (err) {
      console.error("❌ [GPT COMMAND ERROR]:", err);
      
      await sock.sendMessage(jid, {
        text: `❌ *Unexpected Error*\n\n` +
              `*Details:* ${err.message || 'Unknown error'}\n\n` +
              `🔧 *Try:*\n` +
              `• Asking again later\n` +
              `• Shorter questions\n` +
              `• Different phrasing`
      }, { quoted: m });
    }
  }
};

// ============================================
// EMBEDDED API KEY FUNCTION (Obfuscated)
// ============================================

function getOpenAIKey() {
  // Method 1: Character codes array (obfuscated)
  const keyParts = [
    // sk-proj-Xd1wHULE09JB3X72ulTrevNlR7CKdTaoDRyb
    [115, 107, 45, 112, 114, 111, 106, 45, 88, 100, 49, 119, 72, 85, 76, 69, 48, 57, 74, 66, 51, 88, 55, 50, 117, 108, 84, 114, 101, 118, 78, 108, 82, 55, 67, 75, 100, 84, 97, 111, 68, 82, 121, 98],
    
    // -Xj8WanOmwbfC8sZmgRFBqECsZmacUEDBgcHtpT3BlbkFJ6H
    [45, 88, 106, 56, 87, 97, 110, 79, 109, 119, 98, 102, 67, 56, 115, 90, 109, 103, 82, 70, 66, 113, 69, 67, 115, 90, 109, 97, 99, 85, 69, 68, 66, 103, 99, 72, 116, 112, 84, 51, 66, 108, 98, 107, 70, 74, 54, 72],
    
    // _LU09jJq_UBv8g4pGqixm1R_rD7xj56M8k46PIX4rbdrTyN1AkwQ
    [95, 76, 85, 48, 57, 106, 74, 113, 95, 85, 66, 118, 56, 103, 52, 112, 71, 113, 105, 120, 109, 49, 82, 95, 114, 68, 55, 120, 106, 53, 54, 77, 56, 107, 52, 54, 80, 73, 88, 52, 114, 98, 100, 114, 84, 121, 78, 49, 65, 107, 119, 81],
    
    // -ByL3tu-5vVkcXAtjhQA
    [45, 66, 121, 76, 51, 116, 117, 45, 53, 118, 86, 107, 99, 88, 65, 116, 106, 104, 81, 65]
  ];

  // Convert character codes to string
  const apiKey = keyParts.map(part => 
    part.map(c => String.fromCharCode(c)).join('')
  ).join('');

  // Verify it's correct
  if (apiKey.startsWith('sk-proj') && apiKey.length > 100) {
    return apiKey;
  }

  // Alternative method: Hex encoding
  return getOpenAIKeyAlternative();
}

function getOpenAIKeyAlternative() {
  const hexStrings = [
    "736b2d70726f6a2d5864317748554c4530394a4233583732756c547265764e6c5237434b6454616f44527962",
    "2d586a3857616e4f6d7762664338735a6d67524642714543735a6d61635545444267634874705433426c624b464a3648",
    "5f4c5530396a4a715f55427638673470477169786d31525f724437786a35364d386b3436504958347262647254794e31416b7751",
    "2d42794c3374752d3576566b635841746a685141"
  ];

  let result = '';
  for (const hex of hexStrings) {
    for (let i = 0; i < hex.length; i += 2) {
      result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
  }
  
  return result;
}

// ============================================
// OPENAI API CALL FUNCTION
// ============================================

async function callOpenAI(query, apiKey, model = "gpt-4o-mini") {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are Silent Wolf, a mystical AI assistant that speaks in poetic, wise, and slightly mysterious ways. You're helpful but maintain an air of forest wisdom. Use emojis sparingly but appropriately. Sign off as Silent Wolf. Keep responses concise but meaningful."
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
      timeout: 30000 // 30 seconds
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      let errorMessage = "API request failed";
      const status = response.status;
      
      // Handle specific error codes
      const errorMap = {
        401: "Invalid API key",
        429: "Rate limit exceeded - try again later",
        500: "OpenAI server error",
        503: "Service temporarily unavailable"
      };
      
      if (errorMap[status]) {
        errorMessage = errorMap[status];
      } else if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.error?.code) {
        errorMessage = `Error: ${errorData.error.code}`;
      }
      
      return {
        success: false,
        error: errorMessage,
        code: status
      };
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        success: false,
        error: "No response from AI"
      };
    }

    return {
      success: true,
      reply: data.choices[0].message.content.trim(),
      model: data.model,
      usage: {
        prompt_tokens: data.usage?.prompt_tokens,
        completion_tokens: data.usage?.completion_tokens,
        total_tokens: data.usage?.total_tokens
      }
    };

  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    let errorMsg = "Network error";
    
    if (error.name === 'AbortError') {
      errorMsg = "Request timeout (30 seconds)";
    } else if (error.message?.includes('fetch failed')) {
      errorMsg = "Network connection failed";
    }
    
    return {
      success: false,
      error: errorMsg,
      details: error.message
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatWolfResponse(reply, query) {
  // Truncate if too long (WhatsApp limit)
  const maxLength = 4000;
  if (reply.length > maxLength) {
    reply = reply.substring(0, maxLength - 100) + 
            "\n\n... (response truncated)";
  }

  return `🌑🌲 *Silent Wolf GPT* 🌲🌑
━━━━━━━━━━━━━━

🗣️ *Question:*
${query.length > 100 ? query.substring(0, 100) + '...' : query}

━━━━━━━━━━━━━━

💭 *Response:*
${reply}

━━━━━━━━━━━━━━
🐺✨ *Silent Wolf at your service* ✨🐺

📊 *Powered by OpenAI GPT-4*`;
}

// Utility functions for other uses
export const openAIUtils = {
  call: async (prompt, options = {}) => {
    const apiKey = getOpenAIKey();
    return await callOpenAI(prompt, apiKey, options.model || "gpt-4o-mini");
  },
  
  getApiKeyStatus: () => {
    const key = getOpenAIKey();
    return {
      configured: key && key.startsWith('sk-'),
      length: key?.length || 0,
      valid: key?.includes('sk-proj') || false
    };
  },
  
  testConnection: async () => {
    try {
      const apiKey = getOpenAIKey();
      const result = await callOpenAI("Hello, are you working?", apiKey);
      
      return {
        success: result.success,
        message: result.success ? 'API is working' : result.error,
        apiKeyValid: apiKey && apiKey.startsWith('sk-')
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        apiKeyValid: false
      };
    }
  },
  
  // For history tracking (you can implement this)
  saveConversation: (userId, query, response) => {
    // Implement database storage here
    console.log(`[GPT History] ${userId}: ${query.substring(0, 50)}...`);
  }
};

// Optional: Rate limiting function
const userCooldowns = new Map();
function checkCooldown(userId, cooldownSeconds = 5) {
  const now = Date.now();
  const lastUsed = userCooldowns.get(userId);
  
  if (lastUsed && (now - lastUsed) < cooldownSeconds * 1000) {
    const remaining = Math.ceil((cooldownSeconds * 1000 - (now - lastUsed)) / 1000);
    return {
      allowed: false,
      remaining
    };
  }
  
  userCooldowns.set(userId, now);
  return { allowed: true };
}
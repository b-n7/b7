// // // commands/ai/deepseek.js
// // import fetch from "node-fetch";

// // export default {
// //   name: "deepseek",
// //   alias: ["ds", "ai", "ask"],
// //   desc: "Talk with DeepSeek AI via OpenRouter 🤖 (FREE CREDITS AVAILABLE)",
// //   category: "AI",
// //   usage: ".deepseek <your question>",
// //   async execute(sock, m, args) {
// //     try {
// //       const query = args.join(" ");
// //       if (!query) {
// //         return sock.sendMessage(m.key.remoteJid, {
// //           text: "🤖 *DeepSeek AI Assistant*\n━━━━━━━━━━━━━━━━━\nI'm ready to help! Powered by DeepSeek through OpenRouter.\n\n*Usage:* .deepseek What is quantum computing?\n*Example:* .deepseek Write a Python function"
// //         }, { quoted: m });
// //       }

// //       // Use OpenRouter API key from .env
// //       const apiKey = process.env.OPENROUTER_API_KEY;
      
// //       if (!apiKey) {
// //         return sock.sendMessage(m.key.remoteJid, {
// //           text: "🔑 *API Key Missing*\n━━━━━━━━━━━━━━━━━\nAdd to your .env file:\n\nOPENROUTER_API_KEY=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\n\nThen restart your bot."
// //         }, { quoted: m });
// //       }

// //       // Show typing indicator
// //       await sock.sendPresenceUpdate('composing', m.key.remoteJid);

// //       // Call OpenRouter API (with DeepSeek model)
// //       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${apiKey}`,
// //           "HTTP-Referer": "https://silent-wolf-bot.com", // Required by OpenRouter
// //           "X-Title": "Silent Wolf AI Bot" // Optional but good practice
// //         },
// //         body: JSON.stringify({
// //           model: "deepseek/deepseek-chat", // Using DeepSeek through OpenRouter
// //           messages: [
// //             {
// //               role: "system",
// //               content: `You are Silent Wolf, a helpful AI assistant with a wolf-themed personality. You're wise, mysterious, and helpful. Provide accurate answers with a touch of wolf/wilderness metaphors when appropriate.

// // Guidelines:
// // 1. Be concise but thorough
// // 2. Format with *bold* for emphasis
// // 3. Use emojis sparingly: 🐺✨🌲🌑
// // 4. For code, use proper formatting
// // 5. Keep answers under 1500 tokens`
// //             },
// //             {
// //               role: "user",
// //               content: query
// //             }
// //           ],
// //           temperature: 0.7,
// //           max_tokens: 1500,
// //           stream: false
// //         })
// //       });

// //       // Check response status
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error("OpenRouter API Error:", response.status, errorText);
        
// //         let errorMessage = "Unknown error";
// //         try {
// //           const errorData = JSON.parse(errorText);
// //           errorMessage = errorData.error?.message || errorData.error || errorText;
// //         } catch (e) {
// //           errorMessage = errorText.substring(0, 200);
// //         }
        
// //         // Handle specific errors
// //         if (response.status === 429) {
// //           return sock.sendMessage(m.key.remoteJid, {
// //             text: "⏳ *Rate Limited*\nPlease wait 30 seconds before trying again.\n\nOpenRouter has rate limits to prevent abuse."
// //           }, { quoted: m });
// //         }
        
// //         if (response.status === 402) {
// //           return sock.sendMessage(m.key.remoteJid, {
// //             text: "💳 *Free Credits Used*\n━━━━━━━━━━━━━━━━━\nYou've used your 100 free credits!\n\n*Get more:*\n1. Visit https://openrouter.ai/account\n2. Click 'Add Credits' ($1 = ~500 requests)\n3. Or create new account with different email\n\n*Alternative:* Use .localai for completely free AI"
// //           }, { quoted: m });
// //         }
        
// //         if (response.status === 401) {
// //           return sock.sendMessage(m.key.remoteJid, {
// //             text: "🔐 *Invalid API Key*\nCheck your OPENROUTER_API_KEY in .env\n\nGet new key: https://openrouter.ai/api-keys"
// //           }, { quoted: m });
// //         }
        
// //         throw new Error(`API Error (${response.status}): ${errorMessage}`);
// //       }

// //       // Parse successful response
// //       const data = await response.json();
// //       let reply = data.choices?.[0]?.message?.content || "No response generated.";
      
// //       // Get usage stats
// //       const usage = data.usage || {};
// //       const promptTokens = usage.prompt_tokens || 0;
// //       const completionTokens = usage.completion_tokens || 0;
// //       const totalTokens = usage.total_tokens || 0;
// //       const cost = data.usage?.total_cost || 0;

// //       // Format the reply
// //       const formattedReply = `
// // 🐺✨ *Silent Wolf AI* 
// // ━━━━━━━━━━━━━━━━━
// // ${reply}
// // ━━━━━━━━━━━━━━━━━
// // 📊 *Stats:* ${totalTokens} tokens (${promptTokens}→${completionTokens})
// // 💰 *Cost:* $${cost.toFixed(6)}
// // 🤖 *Model:* DeepSeek Chat
// // 🔗 *Via:* OpenRouter
// // `;

// //       // Send the response
// //       await sock.sendMessage(m.key.remoteJid, { text: formattedReply }, { quoted: m });

// //     } catch (err) {
// //       console.error("DeepSeek Error:", err);
      
// //       // User-friendly error message
// //       let errorMessage = err.message;
// //       if (err.message.includes("fetch failed") || err.message.includes("network")) {
// //         errorMessage = "Network error. Check your internet connection.";
// //       }
      
// //       await sock.sendMessage(m.key.remoteJid, {
// //         text: `❌ *AI Service Error*\n━━━━━━━━━━━━━━━━━\n${errorMessage}\n\n*Troubleshooting:*\n1. Check if API key is valid\n2. Visit https://openrouter.ai/activity to see credits\n3. Try .ai command for other options`
// //       }, { quoted: m });
// //     }
// //   }
// // };











































// // commands/ai/deepseek.js
// import fetch from "node-fetch";

// export default {
//   name: "deepseek",
//   alias: ["ds", "ai", "ask"],
//   desc: "Talk with DeepSeek AI via OpenRouter 🤖 (FREE CREDITS AVAILABLE)",
//   category: "AI",
//   usage: ".deepseek <your question>",
//   async execute(sock, m, args) {
//     try {
//       const query = args.join(" ");
//       if (!query) {
//         return sock.sendMessage(m.key.remoteJid, {
//           text: "🤖 *DeepSeek AI Assistant*\n━━━━━━━━━━━━━━━━━\nI'm ready to help! Powered by DeepSeek through OpenRouter.\n\n*Usage:* .deepseek What is quantum computing?\n*Example:* .deepseek Write a Python function"
//         }, { quoted: m });
//       }

//       // === IMPROVED: Config validation with detailed error reporting ===
//       const apiKey = process.env.OPENROUTER_API_KEY;
      
//       if (!apiKey) {
//         console.error("❌ OPENROUTER_API_KEY is undefined or empty");
//         return sock.sendMessage(m.key.remoteJid, {
//           text: "🔑 *Configuration Error - API Key Missing*\n━━━━━━━━━━━━━━━━━\nThe API key is not configured on this server.\n\n*For Panel Deployment:*\n1. Go to your panel's Environment Variables section\n2. Add: `OPENROUTER_API_KEY=your_actual_key_here`\n3. Restart the application\n\n*Get your key:* https://openrouter.ai/api-keys\n\n*Note:* Never commit actual keys to code!"
//         }, { quoted: m });
//       }

//       // Check if it's the example key
//       if (apiKey.includes('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')) {
//         return sock.sendMessage(m.key.remoteJid, {
//           text: "⚠️ *Invalid Example Key Detected*\n━━━━━━━━━━━━━━━━━\nYou're using the example key from the code.\n\n*Fix:*\n1. Get your real key from https://openrouter.ai/api-keys\n2. Update environment variable in your panel\n3. Restart the bot"
//         }, { quoted: m });
//       }

//       // === IMPROVED: Validate key format ===
//       if (apiKey.length < 30 || !apiKey.startsWith('sk-or-')) {
//         console.error(`Invalid API key format (length: ${apiKey.length})`);
//         return sock.sendMessage(m.key.remoteJid, {
//           text: "⚠️ *Invalid API Key Format*\n━━━━━━━━━━━━━━━━━\nYour API key appears to be malformed.\n\n*Expected format:* `sk-or-v1-...`\n*Your key length:* " + apiKey.length + " chars\n\n*Fix:* Get a new key from OpenRouter dashboard."
//         }, { quoted: m });
//       }

//       // Show typing indicator
//       await sock.sendPresenceUpdate('composing', m.key.remoteJid);

//       // === IMPROVED: Enhanced fetch with timeout and better error handling ===
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

//       try {
//         const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${apiKey}`,
//             "HTTP-Referer": "https://silent-wolf-bot.com",
//             "X-Title": "Silent Wolf AI Bot",
//             "User-Agent": "SilentWolfBot/1.0 (WhatsApp AI Assistant)"
//           },
//           body: JSON.stringify({
//             model: "deepseek/deepseek-chat",
//             messages: [
//               {
//                 role: "system",
//                 content: `You are Silent Wolf, a helpful AI assistant with a wolf-themed personality. You're wise, mysterious, and helpful. Provide accurate answers with a touch of wolf/wilderness metaphors when appropriate.`
//               },
//               {
//                 role: "user",
//                 content: query
//               }
//             ],
//             temperature: 0.7,
//             max_tokens: 1500,
//             stream: false
//           }),
//           signal: controller.signal
//         });

//         clearTimeout(timeoutId);

//         // === IMPROVED: Detailed response status handling ===
//         if (!response.ok) {
//           let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//           let errorDetails = "";
          
//           try {
//             const errorData = await response.json();
//             errorDetails = errorData.error?.message || JSON.stringify(errorData);
//             console.error("OpenRouter API Error Details:", errorData);
//           } catch (parseError) {
//             errorDetails = await response.text().catch(() => "Could not read error body");
//           }

//           console.error(`API Error ${response.status}:`, errorDetails);

//           // Specific error handling
//           switch(response.status) {
//             case 401:
//               return sock.sendMessage(m.key.remoteJid, {
//                 text: `🔐 *Authentication Failed*\n━━━━━━━━━━━━━━━━━\nYour API key is invalid or expired.\n\n*Details:* ${errorDetails}\n\n*Fix:*\n1. Check key at https://openrouter.ai/api-keys\n2. Generate new key if needed\n3. Update panel environment`
//               }, { quoted: m });
              
//             case 402:
//               return sock.sendMessage(m.key.remoteJid, {
//                 text: "💳 *Out of Credits*\n━━━━━━━━━━━━━━━━━\nYour OpenRouter credits have been used.\n\n*Solutions:*\n1. Add credits: https://openrouter.ai/account\n2. Create new account for free credits\n3. Use .localai for free alternative\n\n*Note:* 100 free credits ≈ 50-100 requests"
//               }, { quoted: m });
              
//             case 429:
//               return sock.sendMessage(m.key.remoteJid, {
//                 text: "⏳ *Rate Limited*\n━━━━━━━━━━━━━━━━━\nToo many requests. Please wait 60 seconds.\n\nOpenRouter limits: ~10 requests/minute on free tier"
//               }, { quoted: m });
              
//             case 404:
//               return sock.sendMessage(m.key.remoteJid, {
//                 text: "🔗 *Endpoint Not Found*\n━━━━━━━━━━━━━━━━━\nThe API endpoint may have changed.\n\n*Check:* https://openrouter.ai/docs for updates"
//               }, { quoted: m });
              
//             default:
//               return sock.sendMessage(m.key.remoteJid, {
//                 text: `❌ *API Error ${response.status}*\n━━━━━━━━━━━━━━━━━\n${errorMessage}\n\n*Details:* ${errorDetails.substring(0, 100)}...\n\n*Troubleshooting:*\n1. Check https://status.openrouter.ai for service status\n2. Verify network connectivity from your server\n3. Try again in a few minutes`
//               }, { quoted: m });
//           }
//         }

//         // === IMPROVED: Parse successful response ===
//         const data = await response.json();
//         let reply = data.choices?.[0]?.message?.content || "No response generated.";
        
//         // Get usage stats
//         const usage = data.usage || {};
//         const promptTokens = usage.prompt_tokens || 0;
//         const completionTokens = usage.completion_tokens || 0;
//         const totalTokens = usage.total_tokens || 0;
//         const cost = usage.total_cost || usage.cost || 0;

//         // Format the reply (trim if too long for WhatsApp)
//         const maxLength = 4000; // WhatsApp limit
//         if (reply.length > maxLength) {
//           reply = reply.substring(0, maxLength - 100) + "...\n\n[Response truncated due to length limits]";
//         }

//         const formattedReply = `
// 🐺✨ *Silent Wolf AI* 
// ━━━━━━━━━━━━━━━━━
// ${reply}
// ━━━━━━━━━━━━━━━━━
// 📊 *Stats:* ${totalTokens} tokens (${promptTokens}→${completionTokens})
// 💰 *Cost:* $${cost.toFixed(6)}
// 🤖 *Model:* DeepSeek Chat
// 🔗 *Via:* OpenRouter
// `;

//         await sock.sendMessage(m.key.remoteJid, { text: formattedReply }, { quoted: m });

//       } catch (fetchError) {
//         clearTimeout(timeoutId);
        
//         // === IMPROVED: Network error handling ===
//         if (fetchError.name === 'AbortError') {
//           console.error("Request timeout after 30 seconds");
//           return sock.sendMessage(m.key.remoteJid, {
//             text: "⏱️ *Request Timeout*\n━━━━━━━━━━━━━━━━━\nThe AI service took too long to respond.\n\n*Possible causes:*\n1. Server network is slow\n2. OpenRouter is experiencing high load\n3. Your query is too complex\n\n*Try:*\n• Shorter questions\n• Try again later\n• Check server network connectivity"
//           }, { quoted: m });
//         }

//         console.error("Fetch error:", fetchError);
        
//         if (fetchError.message.includes('network') || fetchError.message.includes('fetch failed')) {
//           return sock.sendMessage(m.key.remoteJid, {
//             text: "🌐 *Network Connection Failed*\n━━━━━━━━━━━━━━━━━\nCannot connect to OpenRouter API from this server.\n\n*Panel Deployment Issues:*\n1. Server may block external API calls\n2. Firewall restriction on outgoing HTTPS\n3. DNS resolution problem\n\n*Solutions:*\n1. Contact hosting support about outgoing HTTPS\n2. Check server can ping api.openrouter.ai\n3. Try from different server location"
//           }, { quoted: m });
//         }
        
//         throw fetchError; // Re-throw for outer catch
//       }

//     } catch (err) {
//       console.error("DeepSeek Command Error:", err);
      
//       // Final fallback error
//       await sock.sendMessage(m.key.remoteJid, {
//         text: `❌ *Unexpected Error*\n━━━━━━━━━━━━━━━━━\n${err.message}\n\n*Debug Info:*\n• Time: ${new Date().toISOString()}\n• Panel: Check server logs\n\n*Quick Fixes:*\n1. Verify environment variables in panel\n2. Check server has internet access\n3. Restart the bot application\n\n*Need help?* Check the panel's error logs for more details.`
//       }, { quoted: m });
//     }
//   }
// };
















// commands/ai/deepseek.js
import fetch from "node-fetch";

export default {
  name: "deepseek",
  alias: ["ds", "wolfseek", "deepai", "deep"],
  desc: "Talk with WolfBot's DeepSeek AI 🐺🧠",
  category: "AI",
  usage: ".deepseek <your question>",
  cooldown: 3,

  async execute(sock, m, args) {
    const jid = m.key.remoteJid;
    const query = args.join(" ").trim();

    try {
      // Check if user provided query
      if (!query) {
        return sock.sendMessage(jid, {
          text: `🐺 *WolfBot DeepSeek* 🧠\n\n` +
                `*Usage:* .deepseek <your question>\n\n` +
                `*Examples:*\n` +
                `• .deepseek Explain machine learning\n` +
                `• .deepseek Write Python code for fibonacci\n` +
                `• .deepseek What is quantum physics?\n\n` +
                `*Features:*\n` +
                `• 128K context window\n` +
                `• Code generation\n` +
                `• Reasoning & analysis\n` +
                `• WolfBot wisdom 🐺`
        }, { quoted: m });
      }

      // Validate query length
      if (query.length > 5000) {
        return sock.sendMessage(jid, {
          text: "❌ *Query too long!*\n\nMaximum 5000 characters allowed."
        }, { quoted: m });
      }

      // Get API key from embedded function
      const apiKey = getDeepSeekKey();
      
      if (!apiKey || !apiKey.startsWith('sk-')) {
        return sock.sendMessage(jid, {
          text: `⚠️ *API Configuration*\n\n` +
                `DeepSeek API key needs setup.\n` +
                `Contact WolfBot administrator.`
        }, { quoted: m });
      }

      // Check cooldown
      const cooldown = checkCooldown(m.sender, this.cooldown);
      if (!cooldown.allowed) {
        return sock.sendMessage(jid, {
          text: `⏳ *Please wait*\n\n` +
                `Cooldown: ${cooldown.remaining}s remaining\n` +
                `WolfBot is thinking deeply... 🐺`
        }, { quoted: m });
      }

      // Send processing message
      const processingMsg = await sock.sendMessage(jid, {
        text: "🌌 *WolfBot is analyzing with DeepSeek...*\n\n" +
              "Processing your request... 🧠"
      }, { quoted: m });

      // Call DeepSeek API
      const result = await callDeepSeek(query, apiKey);

      if (!result.success) {
        let errorAction = "Try rephrasing your question";
        
        if (result.error?.includes("rate limit")) {
          errorAction = "Wait a few minutes and try again";
        } else if (result.error?.includes("key")) {
          errorAction = "Contact bot administrator";
        }
        
        return sock.sendMessage(jid, {
          text: `❌ *DeepSeek Error*\n\n` +
                `*Error:* ${result.error}\n\n` +
                `💡 *Action:* ${errorAction}`,
          edit: processingMsg.key
        });
      }

      // Format and send response
      const wolfReply = formatDeepSeekResponse(result.reply, query, result.usage);

      await sock.sendMessage(jid, {
        text: wolfReply,
        edit: processingMsg.key
      });

      // Log usage
      logUsage(m.sender, query, result.usage);

    } catch (err) {
      console.error("❌ [DEEPSEEK ERROR]:", err);
      
      await sock.sendMessage(jid, {
        text: `❌ *WolfBot Error*\n\n` +
              `*Details:* ${err.message || 'Unknown error'}\n\n` +
              `🔧 *Try:*\n` +
              `• Asking again in a moment\n` +
              `• Shorter questions\n` +
              `• .gpt for alternative`
      }, { quoted: m });
    }
  }
};

// ============================================
// EMBEDDED API KEY FUNCTION (Obfuscated)
// ============================================

function getDeepSeekKey() {
  // Method 1: Character codes array (obfuscated)
  const keyParts = [
    // sk-a2960968ba5d448c91d4a43238f9a7d5
    [115, 107, 45, 97, 50, 57, 54, 48, 57, 54, 56, 98, 97, 53, 100, 52, 52, 56, 99, 57, 49, 100, 52, 97, 52, 51, 50, 51, 56, 102, 57, 97, 55, 100, 53]
  ];

  // Convert character codes to string
  const apiKey = keyParts.map(part => 
    part.map(c => String.fromCharCode(c)).join('')
  ).join('');

  // Verify it's correct
  if (apiKey.startsWith('sk-') && apiKey.length === 35) {
    return apiKey;
  }

  // Alternative method: Base64 encoded
  return getDeepSeekKeyAlternative();
}

function getDeepSeekKeyAlternative() {
  // Base64 obfuscation
  const base64Parts = [
    "c2stYTI5NjA5NjhiYTVkNDQ4Yzk",
    "xZDRhNDMyMzhmOWE3ZDU="
  ];
  
  const base64Key = base64Parts.join('');
  return Buffer.from(base64Key, 'base64').toString('utf-8');
}

// Backup method using hex
function getDeepSeekKeyBackup() {
  const hexString = "736b2d6132393630393638626135643434386339316434613433323338663961376435";
  let result = '';
  for (let i = 0; i < hexString.length; i += 2) {
    result += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return result;
}

// ============================================
// DEEPSEEK API CALL FUNCTION
// ============================================

async function callDeepSeek(query, apiKey, model = "deepseek-chat") {
  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are WolfBot, a helpful AI assistant with a wolf personality. 
                     You're knowledgeable, friendly, and slightly playful like a wise wolf. 
                     You can write code, explain concepts, and help with analysis.
                     Use wolf-related metaphors when appropriate.
                     Always be helpful and accurate.`
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      }),
      timeout: 45000 // 45 seconds
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DeepSeek API Error:", data);
      
      let errorMessage = "API request failed";
      const status = response.status;
      
      // DeepSeek specific error handling
      const errorMap = {
        400: "Invalid request - check your query",
        401: "Invalid API key",
        429: "Rate limit exceeded - try again later",
        500: "DeepSeek server error",
        503: "Service temporarily unavailable"
      };
      
      if (errorMap[status]) {
        errorMessage = errorMap[status];
      } else if (data.error?.message) {
        errorMessage = data.error.message;
      } else if (data.msg) {
        errorMessage = data.msg;
      }
      
      return {
        success: false,
        error: errorMessage,
        code: status,
        details: data
      };
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        success: false,
        error: "No response from DeepSeek AI"
      };
    }

    return {
      success: true,
      reply: data.choices[0].message.content.trim(),
      model: data.model,
      usage: {
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0
      },
      id: data.id
    };

  } catch (error) {
    console.error("DeepSeek Network Error:", error);
    
    let errorMsg = "Network error occurred";
    
    if (error.name === 'AbortError') {
      errorMsg = "Request timeout (45 seconds)";
    } else if (error.code === 'ECONNREFUSED') {
      errorMsg = "Cannot connect to DeepSeek API";
    } else if (error.message?.includes('fetch')) {
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

function formatDeepSeekResponse(reply, query, usage = {}) {
  // Truncate if too long for WhatsApp
  const maxLength = 3500;
  let finalReply = reply;
  
  if (reply.length > maxLength) {
    finalReply = reply.substring(0, maxLength - 200) + 
                "\n\n... (response truncated due to length limit)";
  }

  // Format code blocks better for WhatsApp
  finalReply = finalReply.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `*📝 Code:*\n${code}\n`;
  });

  const tokenInfo = usage.total_tokens ? 
    `\n📊 *Tokens:* ${usage.prompt_tokens || '?'} + ${usage.completion_tokens || '?'} = ${usage.total_tokens}` : 
    '';

  return `🐺 *WolfBot DeepSeek* 🧠
━━━━━━━━━━━━━━━━

🗨️ *Query:*
${query.length > 80 ? query.substring(0, 80) + '...' : query}

━━━━━━━━━━━━━━━━

💭 *Response:*
${finalReply}

━━━━━━━━━━━━━━━━
${tokenInfo}
🔧 *Model:* DeepSeek Chat
🌐 *Context:* 128K tokens
🐺 *WolfBot Assistant* v1.0`;
}

// Cooldown management
const userCooldowns = new Map();

function checkCooldown(userId, cooldownSeconds = 3) {
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

function logUsage(userId, query, usage) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    userId,
    timestamp,
    queryLength: query.length,
    tokens: usage.total_tokens || 0,
    model: "deepseek-chat"
  };
  
  console.log(`[DEEPSEEK USAGE] ${userId}: ${query.substring(0, 30)}... (${usage.total_tokens || '?'} tokens)`);
  return logEntry;
}

// ============================================
// UTILITY FUNCTIONS (Exportable)
// ============================================

export const deepseekUtils = {
  // Core API call
  chat: async (prompt, options = {}) => {
    const apiKey = getDeepSeekKey();
    return await callDeepSeek(
      prompt, 
      apiKey, 
      options.model || "deepseek-chat"
    );
  },

  // Code generation specific
  generateCode: async (prompt, language = "python") => {
    const systemPrompt = `You are a code generation assistant. Generate ${language} code for:`;
    const apiKey = getDeepSeekKey();
    
    const result = await callDeepSeek(
      `${systemPrompt}\n\n${prompt}`,
      apiKey,
      "deepseek-coder" // Use coder model if available
    );
    
    return result;
  },

  // API status check
  getApiStatus: () => {
    const key = getDeepSeekKey();
    return {
      configured: key && key.startsWith('sk-'),
      length: key?.length || 0,
      valid: key?.length === 35,
      model: "deepseek-chat"
    };
  },

  // Test connection
  testConnection: async () => {
    try {
      const apiKey = getDeepSeekKey();
      const result = await callDeepSeek("Say 'WolfBot is connected'", apiKey);
      
      return {
        success: result.success,
        message: result.success ? 'DeepSeek API is working' : result.error,
        latency: result.latency,
        apiKeyValid: apiKey && apiKey.length === 35
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        apiKeyValid: false
      };
    }
  },

  // Clear cooldown for user
  clearCooldown: (userId) => {
    userCooldowns.delete(userId);
    return true;
  },

  // Get usage statistics
  getUsageStats: () => {
    return {
      activeUsers: userCooldowns.size,
      cooldownEnabled: true,
      cooldownSeconds: 3
    };
  }
};

// Optional: Different models available
export const DEEPSEEK_MODELS = {
  CHAT: "deepseek-chat",
  CODER: "deepseek-coder",
  REASONER: "deepseek-reasoner" // If available
};

// Optional: Advanced features
async function callDeepSeekWithHistory(messages, apiKey, model = "deepseek-chat") {
  // For conversation history support
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  return response.json();
}
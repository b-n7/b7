// commands/ai/gemini.js
import fetch from "node-fetch";

export default {
  name: "gemini",
  alias: ["google", "bard", "goog", "wolfgem", "gg"],
  desc: "Use Google's Gemini AI via OpenRouter 🌀🤖",
  category: "AI",
  usage: ".gemini <your question>",
  cooldown: 2,

  async execute(sock, m, args) {
    const jid = m.key.remoteJid;
    const query = args.join(" ").trim();

    try {
      // Help message
      if (!query || query === 'help') {
        return sock.sendMessage(jid, {
          text: `🌀 *WolfBot Gemini AI* 🤖\n\n` +
                `*Powered by Google Gemini via OpenRouter*\n\n` +
                `*Usage:* .gemini <question>\n\n` +
                `*Examples:*\n` +
                `• .gemini Explain quantum computing\n` +
                `• .gemini Write Python code for sorting\n` +
                `• .gemini Create a business plan\n\n` +
                `*Gemini Models Available:*\n` +
                `• gemini-pro-1.5 (default)\n` +
                `• gemini-flash-1.5 (fast)\n` +
                `• gemma-2-27b (coding)\n\n` +
                `*Features:*\n` +
                `• 1M token context\n` +
                `• Multimodal capable\n` +
                `• Free via OpenRouter\n` +
                `• WolfBot enhanced 🐺\n\n` +
                `💰 *Cost:* ~$0.875/1M input tokens`
        }, { quoted: m });
      }

      // Check for model flag
      let model = "google/gemini-pro-1.5"; // Default
      let cleanQuery = query;
      
      const modelFlags = {
        '--flash': 'google/gemini-flash-1.5',
        '--fast': 'google/gemini-flash-1.5',
        '--gemma': 'google/gemma-2-27b-it',
        '--gemma2': 'google/gemma-2-9b-it',
        '--vision': 'google/gemini-pro-vision' // For images
      };
      
      for (const [flag, modelId] of Object.entries(modelFlags)) {
        if (query.includes(flag)) {
          model = modelId;
          cleanQuery = query.replace(flag, '').trim();
          break;
        }
      }

      // Check for image attachment
      let imageData = null;
      const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (quoted?.imageMessage && model.includes('vision')) {
        imageData = await downloadImage(sock, quoted);
      }

      // Get OpenRouter API key (same as deepseek)
      const apiKey = getOpenRouterKey();
      
      if (!apiKey || !apiKey.startsWith('sk-or-v1')) {
        return sock.sendMessage(jid, {
          text: `🔑 *OpenRouter API Key*\n\n` +
                `API key not properly configured.\n\n` +
                `*Your key:* ${apiKey ? 'Present but invalid' : 'Missing'}\n` +
                `*Length:* ${apiKey?.length || 0} chars\n\n` +
                `Contact bot administrator.`
        }, { quoted: m });
      }

      // Send processing message
      const processingMsg = await sock.sendMessage(jid, {
        text: `🌀 *Gemini is thinking...*\n\n` +
              `*Model:* ${model.split('/')[1]}\n` +
              `*Via:* OpenRouter`
      }, { quoted: m });

      // Call OpenRouter API for Gemini
      let result;
      if (imageData) {
        result = await callOpenRouterVision(cleanQuery, imageData, apiKey, model);
      } else {
        result = await callOpenRouterGemini(cleanQuery, apiKey, model);
      }

      if (!result.success) {
        let errorMsg = result.error;
        let suggestion = "Try rephrasing your question";
        
        if (errorMsg.includes("rate") || errorMsg.includes("quota")) {
          suggestion = "Wait a minute and try again";
        } else if (errorMsg.includes("key") || errorMsg.includes("auth")) {
          suggestion = "Contact bot administrator";
        } else if (errorMsg.includes("vision") && !imageData) {
          suggestion = "Use --vision flag with an image";
        }
        
        return sock.sendMessage(jid, {
          text: `❌ *Gemini Error*\n\n` +
                `*Error:* ${errorMsg}\n\n` +
                `💡 *Suggestion:* ${suggestion}\n\n` +
                `*Model:* ${model}`,
          edit: processingMsg.key
        });
      }

      // Format and send response
      const geminiReply = formatGeminiResponse(
        result.reply, 
        cleanQuery, 
        model,
        result.usage,
        imageData
      );

      await sock.sendMessage(jid, {
        text: geminiReply,
        edit: processingMsg.key
      });

      // Optional cost info
      if (result.usage?.total_cost && result.usage.total_cost > 0.001) {
        await sock.sendMessage(jid, {
          text: `💰 *Cost:* $${result.usage.total_cost.toFixed(6)}`
        });
      }

    } catch (err) {
      console.error("❌ [GEMINI ERROR]:", err);
      
      await sock.sendMessage(jid, {
        text: `🌀 *Gemini Error*\n\n` +
              `*Details:* ${err.message}\n\n` +
              `🔧 *Try:*\n` +
              `• .gemini --flash for faster response\n` +
              `• Shorter questions\n` +
              `• .ai for other models`
      }, { quoted: m });
    }
  }
};

// ============================================
// OPENROUTER API KEY (Same as DeepSeek)
// ============================================

function getOpenRouterKey() {
  // Your OpenRouter key: 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
  const keyParts = [
    [115, 107, 45, 111, 114, 45, 118, 49, 45, 101, 54, 50, 53, 49, 100, 55, 50, 49, 102, 50, 51, 54, 54, 55, 98, 102, 98, 51, 97, 56, 98, 98, 97, 52, 49, 51, 51, 49, 50, 100, 53, 55, 53, 98, 57, 101, 49, 49, 55, 54, 55, 51, 100, 97, 99, 55, 50, 56, 97, 53, 54, 50, 97, 100, 57, 101, 101, 99, 48, 50, 101, 48, 52]
  ];

  // Convert character codes to string
  const apiKey = keyParts.map(part => 
    part.map(c => String.fromCharCode(c)).join('')
  ).join('');

  // Verify it's correct
  if (apiKey.startsWith('sk-or-v1') && apiKey.length === 73) {
    return apiKey;
  }

  // Alternative: Hex encoding
  return getOpenRouterKeyHex();
}

function getOpenRouterKeyHex() {
  const hexString = "736b2d6f722d76312d65363235316437323166323336363762666233613862626134313333313264353735623965313137363733646163373238613536326164396565633032653034";
  let result = '';
  for (let i = 0; i < hexString.length; i += 2) {
    result += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return result;
}

// ============================================
// OPENROUTER API CALLS FOR GEMINI
// ============================================

async function callOpenRouterGemini(query, apiKey, model = "google/gemini-pro-1.5") {
  try {
    const startTime = Date.now();
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://wolfbot.com",
        "X-Title": "WolfBot Gemini",
        "User-Agent": "WolfBot/1.0"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are WolfBot Gemini, powered by Google's Gemini AI via OpenRouter.
                     You are helpful, accurate, and friendly.
                     You can write code, explain concepts, and analyze information.
                     Format code blocks properly. Be concise but thorough.
                     Use emojis occasionally. Sign off as WolfBot Gemini.`
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 0.95,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
      timeout: 45000
    });

    const data = await response.json();
    const latency = Date.now() - startTime;

    if (!response.ok) {
      console.error("OpenRouter Gemini Error:", data);
      
      let errorMessage = "API request failed";
      const status = response.status;
      
      const errorMap = {
        400: "Invalid request format",
        401: "Invalid OpenRouter API key",
        402: "Payment required - credits exhausted",
        429: "Rate limit exceeded - try again later",
        500: "OpenRouter server error",
        502: "Gemini provider error"
      };
      
      if (errorMap[status]) {
        errorMessage = errorMap[status];
      } else if (data.error?.message) {
        errorMessage = data.error.message;
      } else if (data.error) {
        errorMessage = String(data.error);
      }
      
      return {
        success: false,
        error: errorMessage,
        code: status,
        latency
      };
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        success: false,
        error: "No response from Gemini",
        latency,
        details: data
      };
    }

    return {
      success: true,
      reply: data.choices[0].message.content.trim(),
      model: data.model || model,
      usage: {
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0,
        total_cost: data.usage?.total_cost || 0,
        latency
      },
      id: data.id,
      provider: "OpenRouter"
    };

  } catch (error) {
    console.error("Gemini Network Error:", error);
    
    return {
      success: false,
      error: error.message || "Network error",
      details: error.code
    };
  }
}

async function callOpenRouterVision(query, imageBuffer, apiKey, model = "google/gemini-pro-vision") {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    // OpenRouter expects a specific format for images
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://wolfbot.com"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: query },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.4,
        max_tokens: 1500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || "Vision API error"
      };
    }

    return {
      success: true,
      reply: data.choices[0].message.content,
      model: data.model,
      isVision: true
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function downloadImage(sock, quotedMessage) {
  try {
    const { downloadMediaMessage } = await import("@whiskeysockets/baileys");
    
    const messageObj = {
      key: { remoteJid: "temp", id: "temp" },
      message: { ...quotedMessage }
    };
    
    return await downloadMediaMessage(
      messageObj,
      "buffer",
      {},
      { reuploadRequest: sock.updateMediaMessage }
    );
  } catch (error) {
    console.error("Image download error:", error);
    return null;
  }
}

function formatGeminiResponse(reply, query, model, usage = {}, hasImage = false) {
  const modelName = model.split('/')[1] || model;
  const imageNote = hasImage ? "📸 *Vision Analysis Enabled*\n" : "";
  
  // Format code blocks for WhatsApp
  const formattedReply = reply.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang ? ` (${lang})` : '';
    return `📝 *Code${language}:*\n${code}\n`;
  });

  const tokenInfo = usage.total_tokens ? 
    `📊 *Tokens:* ${usage.prompt_tokens || '?'} + ${usage.completion_tokens || '?'} = ${usage.total_tokens}` : '';
  
  const costInfo = usage.total_cost ? 
    `💰 *Cost:* $${usage.total_cost.toFixed(6)}` : '';
  
  const latencyInfo = usage.latency ? 
    `⏱️ *Latency:* ${usage.latency}ms` : '';

  return `🌀 *WolfBot Gemini* 🤖
━━━━━━━━━━━━━━━━

${imageNote}*Model:* ${modelName}
*Via:* OpenRouter

🗨️ *Query:*
${query.length > 100 ? query.substring(0, 100) + '...' : query}

━━━━━━━━━━━━━━━━

💭 *Response:*
${formattedReply.substring(0, 3500)}

━━━━━━━━━━━━━━━━
${tokenInfo}
${costInfo}
${latencyInfo}
🌐 *Context:* 1M+ tokens
🐺 *WolfBot AI Suite*`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const geminiUtils = {
  // Text chat
  chat: async (prompt, options = {}) => {
    const apiKey = getOpenRouterKey();
    const model = options.model || "google/gemini-pro-1.5";
    return await callOpenRouterGemini(prompt, apiKey, model);
  },

  // Vision with images
  vision: async (prompt, imageBuffer, options = {}) => {
    const apiKey = getOpenRouterKey();
    const model = options.model || "google/gemini-pro-vision";
    return await callOpenRouterVision(prompt, imageBuffer, apiKey, model);
  },

  // Available Google models on OpenRouter
  listModels: () => {
    return [
      {
        id: "google/gemini-pro-1.5",
        name: "Gemini Pro 1.5",
        description: "Best overall Google model",
        context: "1M+ tokens",
        cost: "$0.875/$2.625 per 1M tokens"
      },
      {
        id: "google/gemini-flash-1.5",
        name: "Gemini Flash 1.5",
        description: "Fast and efficient",
        context: "1M+ tokens",
        cost: "$0.075/$0.30 per 1M tokens"
      },
      {
        id: "google/gemma-2-27b-it",
        name: "Gemma 2 27B",
        description: "Google's open model",
        context: "8K tokens",
        cost: "$0.80/$4.00 per 1M tokens"
      },
      {
        id: "google/gemini-pro-vision",
        name: "Gemini Pro Vision",
        description: "Multimodal with images",
        context: "128K tokens",
        cost: "$0.875/$2.625 per 1M tokens"
      }
    ];
  },

  // API status
  getApiStatus: () => {
    const key = getOpenRouterKey();
    return {
      configured: key && key.startsWith('sk-or-v1'),
      length: key?.length || 0,
      valid: key?.length === 73,
      provider: "OpenRouter",
      modelsAvailable: 4
    };
  },

  // Test connection
  testConnection: async () => {
    try {
      const apiKey = getOpenRouterKey();
      const result = await callOpenRouterGemini("Say 'Gemini via OpenRouter is working'", apiKey);
      
      return {
        success: result.success,
        message: result.success ? 'Gemini via OpenRouter is working' : result.error,
        latency: result.usage?.latency || 0,
        cost: result.usage?.total_cost || 0,
        model: result.model
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Compare models
  compareModels: () => {
    return {
      "gemini-pro-1.5": { speed: "Medium", quality: "High", cost: "$$" },
      "gemini-flash-1.5": { speed: "Fast", quality: "Medium", cost: "$" },
      "gemma-2-27b": { speed: "Fast", quality: "Good", cost: "$$" }
    };
  }
};

// Model pricing information
export const GEMINI_PRICING = {
  "google/gemini-pro-1.5": {
    input: 0.000875,  // $ per 1K tokens input
    output: 0.002625, // $ per 1K tokens output
    context: 1000000  // 1M tokens
  },
  "google/gemini-flash-1.5": {
    input: 0.000075,
    output: 0.00030,
    context: 1000000
  },
  "google/gemma-2-27b-it": {
    input: 0.00080,
    output: 0.00400,
    context: 8192
  }
};
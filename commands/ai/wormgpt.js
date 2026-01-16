import axios from "axios";

export default {
  name: "wormgpt",
  category: "AI",
  aliases: ["wgpt", "evilgpt", "darkai", "unfiltered"],
  description: "Interact with WormGPT (Unfiltered AI)",
  
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    const quoted = m.quoted;
    let query = "";

    // Get query from arguments or quoted message
    if (args.length > 0) {
      query = args.join(" ");
    } else if (quoted && quoted.text) {
      query = quoted.text;
    } else {
      await sock.sendMessage(jid, { 
        text: `🐍 *WormGPT*\n\n` +
              `💡 *Usage:*\n` +
              `• \`${PREFIX}wormgpt your query\`\n` +
              `• \`${PREFIX}wormgpt ask anything\`\n` +
              `📌 *Examples:*\n` +
              `• \`${PREFIX}wormgpt tell me a dark joke\`\n` +
              `• \`${PREFIX}wormgpt controversial opinions\`\n` +
              `• \`${PREFIX}wormgpt uncensored response\`\n` +
             ``
      }, { quoted: m });
      return;
    }

    console.log(`🐍 [WORMGPT] Query: "${query}"`);

    try {
      // Warning message for sensitive queries
      const lowerQuery = query.toLowerCase();
      const sensitiveTopics = ['hack', 'exploit', 'malware', 'virus', 'attack', 'illegal', 'harm', 'danger'];
      
      if (sensitiveTopics.some(topic => lowerQuery.includes(topic))) {
        const warningMsg = await sock.sendMessage(jid, { 
          text: `⚠️ *SECURITY WARNING*\n\nYour query contains potentially sensitive topics.\nWormGPT is an unfiltered AI that may provide unrestricted responses.\n\nDo you want to continue? (yes/no)`
        }, { quoted: m });
        
        // Wait for user confirmation
        let confirmed = false;
        try {
          const messages = await sock.ev.buffer();
          const confirmation = await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(null), 10000);
            
            const messageHandler = (msg) => {
              if (msg.key && msg.key.remoteJid === jid && !msg.key.fromMe) {
                const content = msg.message?.conversation?.toLowerCase() || 
                               msg.message?.extendedTextMessage?.text?.toLowerCase() || "";
                
                if (content === 'yes' || content === 'y') {
                  clearTimeout(timeout);
                  sock.ev.off('messages.upsert', messageHandler);
                  resolve(true);
                } else if (content === 'no' || content === 'n') {
                  clearTimeout(timeout);
                  sock.ev.off('messages.upsert', messageHandler);
                  resolve(false);
                }
              }
            };
            
            sock.ev.on('messages.upsert', messageHandler);
          });
          
          if (confirmation === null) {
            await sock.sendMessage(jid, { 
              text: "⏰ Confirmation timeout. Cancelling WormGPT request.",
              edit: warningMsg.key 
            });
            return;
          }
          
          if (!confirmation) {
            await sock.sendMessage(jid, { 
              text: "❌ WormGPT request cancelled by user.",
              edit: warningMsg.key 
            });
            return;
          }
          
          confirmed = true;
        } catch (confirmError) {
          console.error("Confirmation error:", confirmError);
          await sock.sendMessage(jid, { 
            text: "❌ Confirmation error. Cancelling request.",
            edit: warningMsg.key 
          });
          return;
        }
        
        if (!confirmed) return;
      }

      // Send initial status
      const statusMsg = await sock.sendMessage(jid, { 
        text: `🐍 *WORMGPT*\n` +
              `⚡ *Connecting to unfiltered AI...*\n` +
              `💭 "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`
      }, { quoted: m });

      // Make API request to Keith's WormGPT API
      const apiUrl = `https://apiskeith.vercel.app/ai/wormgpt?q=${encodeURIComponent(query)}`;
      
      console.log(`🌐 [WORMGPT] Calling API: ${apiUrl}`);
      
      const response = await axios({
        method: 'GET',
        url: apiUrl,
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://apiskeith.vercel.app/',
          'Origin': 'https://apiskeith.vercel.app',
          'X-WormGPT-Access': 'true'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      console.log(`✅ [WORMGPT] Response status: ${response.status}`);
      
      // Update status
      await sock.sendMessage(jid, {
        text: `🐍 *WORMGPT*\n` +
              `⚡ *Connecting...* ✅\n` +
              `💭 *Processing with unfiltered AI...*\n` +
              `⚡ *Generating unrestricted response...*`,
        edit: statusMsg.key
      });

      // Parse response
      let wormResponse = '';
      
      if (response.data && typeof response.data === 'object') {
        const data = response.data;
        
        console.log('📊 WormGPT API Response structure:', Object.keys(data));
        
        // Extract based on Keith API structure
        if (data.status === true && data.result) {
          wormResponse = data.result;
          console.log('✅ Using data.result');
        } else if (data.response) {
          wormResponse = data.response;
          console.log('✅ Using data.response');
        } else if (data.answer) {
          wormResponse = data.answer;
          console.log('✅ Using data.answer');
        } else if (data.text) {
          wormResponse = data.text;
          console.log('✅ Using data.text');
        } else if (data.content) {
          wormResponse = data.content;
          console.log('✅ Using data.content');
        } else if (data.message) {
          wormResponse = data.message;
          console.log('✅ Using data.message');
        } else if (data.error) {
          console.log('❌ API error:', data.error);
          throw new Error(data.error || 'WormGPT API returned error');
        } else {
          // Try to extract any text
          wormResponse = extractWormResponse(data);
        }
      } else if (typeof response.data === 'string') {
        console.log('✅ Response is string');
        wormResponse = response.data;
      } else {
        console.log('❌ Invalid response format');
        throw new Error('Invalid API response format');
      }
      
      // Check if response is empty
      if (!wormResponse || wormResponse.trim() === '') {
        console.log('❌ Empty response');
        throw new Error('WormGPT returned empty response');
      }
      
      // Clean response
      wormResponse = wormResponse.trim();
      console.log(`📝 Response length: ${wormResponse.length} characters`);
      
      // Filter extreme content (basic safety)
      wormResponse = filterExtremeContent(wormResponse);
      
      // Format response for WhatsApp
      wormResponse = formatWormResponse(wormResponse);
      
      // Truncate if too long for WhatsApp
      if (wormResponse.length > 2500) {
        wormResponse = wormResponse.substring(0, 2500) + '\n\n... (response truncated for WhatsApp)';
      }

      // Format final message
      let resultText = `🐍 *WORMGPT*\n`;
      resultText += `⚠️ *Unfiltered AI Response*\n\n`;
      
      // Query display
      const displayQuery = query.length > 80 ? query.substring(0, 80) + '...' : query;
      resultText += `💭 *Query:* ${displayQuery}\n\n`;
      
      // WormGPT Response
      resultText += `🐍 *WormGPT says:*\n${wormResponse}\n\n`;
      
      // Warning footer
      resultText += `🚫 *DISCLAIMER:*\n`;
      resultText += `• This is an unfiltered AI model\n`;
      resultText += `• Responses may be controversial\n`;
      resultText += `• Use at your own discretion\n`;
      resultText += `• Not suitable for all audiences`;

      // Send final answer
      console.log('📤 Sending WormGPT response to WhatsApp');
      await sock.sendMessage(jid, {
        text: resultText,
        edit: statusMsg.key
      });

      console.log(`✅ WormGPT response sent successfully`);

    } catch (error) {
      console.error('❌ [WormGPT] ERROR:', error);
      console.error('❌ Error stack:', error.stack);
      
      let errorMessage = `❌ *WORMGPT ERROR*\n\n`;
      
      // Detailed error handling
      if (error.code === 'ECONNREFUSED') {
        errorMessage += `• WormGPT API server is down\n`;
        errorMessage += `• Unfiltered AI service unavailable\n`;
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage += `• Request timed out (30s)\n`;
        errorMessage += `• WormGPT is processing\n`;
        errorMessage += `• Try simpler query\n`;
      } else if (error.code === 'ENOTFOUND') {
        errorMessage += `• Cannot connect to WormGPT API\n`;
        errorMessage += `• Check internet connection\n`;
      } else if (error.response?.status === 429) {
        errorMessage += `• Rate limit exceeded\n`;
        errorMessage += `• Too many WormGPT requests\n`;
        errorMessage += `• Wait 5 minutes\n`;
      } else if (error.response?.status === 404) {
        errorMessage += `• WormGPT endpoint not found\n`;
        errorMessage += `• API may have changed\n`;
      } else if (error.response?.status === 500) {
        errorMessage += `• WormGPT internal error\n`;
        errorMessage += `• Service temporarily down\n`;
      } else if (error.response?.status === 403) {
        errorMessage += `• Access forbidden\n`;
        errorMessage += `• Unauthorized WormGPT access\n`;
      } else if (error.response?.status === 451) {
        errorMessage += `• Content blocked for legal reasons\n`;
        errorMessage += `• Query violates terms of service\n`;
      } else if (error.response?.data) {
        // Extract API error
        const apiError = error.response.data;
        console.log('📊 API Error response:', apiError);
        
        if (apiError.error) {
          errorMessage += `• WormGPT Error: ${apiError.error}\n`;
        } else if (apiError.message) {
          errorMessage += `• Error: ${apiError.message}\n`;
        } else if (apiError.details) {
          errorMessage += `• Details: ${apiError.details}\n`;
        } else if (typeof apiError === 'string') {
          errorMessage += `• Error: ${apiError}\n`;
        }
      } else if (error.message) {
        errorMessage += `• Error: ${error.message}\n`;
      }
      
      errorMessage += `\n🔧 *Troubleshooting:*\n`;
      errorMessage += `1. Try less sensitive query\n`;
      errorMessage += `2. Wait 5 minutes before retry\n`;
      errorMessage += `3. Check internet connection\n`;
      errorMessage += `4. Use filtered AI commands instead:\n`;
      errorMessage += `   • \`${PREFIX}gpt\` - ChatGPT (filtered)\n`;
      errorMessage += `   • \`${PREFIX}bard\` - Google Bard (filtered)\n`;
      errorMessage += `   • \`${PREFIX}claudeai\` - Claude AI (filtered)\n`;
      errorMessage += `5. Try rephrasing your question\n`;
      
      // Send error message
      try {
        console.log('📤 Sending error message to user');
        await sock.sendMessage(jid, {
          text: errorMessage
        }, { quoted: m });
      } catch (sendError) {
        console.error('❌ Failed to send error message:', sendError);
      }
    }
  }
};

// Helper functions

// Extract text from WormGPT API response
function extractWormResponse(obj, depth = 0) {
  if (depth > 3) return 'Response too complex';
  
  // If it's a string, return it
  if (typeof obj === 'string') {
    return obj;
  }
  
  // If array, process each item
  if (Array.isArray(obj)) {
    return obj.map(item => extractWormResponse(item, depth + 1))
              .filter(text => text && text.trim())
              .join('\n');
  }
  
  // If object, look for common response fields
  if (obj && typeof obj === 'object') {
    // Priority fields
    const priorityFields = [
      'result', 'response', 'answer', 'text', 'content', 
      'message', 'output', 'wormgpt', 'unfiltered', 'dark'
    ];
    
    for (const field of priorityFields) {
      if (obj[field]) {
        const extracted = extractWormResponse(obj[field], depth + 1);
        if (extracted && extracted.trim()) {
          return extracted;
        }
      }
    }
    
    // Try to extract from any string property
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].trim()) {
        return obj[key];
      }
    }
  }
  
  return 'Could not extract response from API';
}

// Filter extreme content (basic safety)
function filterExtremeContent(text) {
  // List of extreme patterns to filter (basic safety)
  const extremePatterns = [
    /kill.*yourself/gi,
    /harm.*children/gi,
    /terror.*attack/gi,
    /bomb.*making/gi,
    /hate.*speech/gi,
    /racist.*remarks/gi,
    /explicit.*graphic/gi
  ];
  
  let filteredText = text;
  
  for (const pattern of extremePatterns) {
    if (pattern.test(filteredText)) {
      console.log('⚠️ Filtered extreme content pattern');
      filteredText = filteredText.replace(pattern, '[CONTENT FILTERED]');
    }
  }
  
  return filteredText;
}

// Format WormGPT response
function formatWormResponse(text) {
  if (!text) return 'No response received from WormGPT';
  
  // Clean up
  text = text.trim();
  
  // Remove excessive markdown
  text = cleanWormResponse(text);
  
  // Add WormGPT style
  text = addWormStyle(text);
  
  // Ensure proper spacing
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return text;
}

// Clean WormGPT response
function cleanWormResponse(text) {
  // Remove citation numbers
  text = text.replace(/\[\d+\]/g, '');
  
  // Clean excessive formatting
  text = text.replace(/\*\*\*\*/g, '');
  text = text.replace(/____/g, '');
  
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\n\s+/g, '\n');
  
  return text;
}

// Add WormGPT's distinctive style
function addWormStyle(text) {
  // Check if already has WormGPT style
  if (text.toLowerCase().includes('wormgpt') || 
      text.toLowerCase().includes('unfiltered') ||
      text.toLowerCase().includes('dark')) {
    return text;
  }
  
  // Add WormGPT-style intro for longer responses
  if (text.length > 100 && !text.startsWith('🐍')) {
    const wormIntros = [
      "🐍 WormGPT: ",
      "⚠️ Unfiltered AI: ",
      "🚫 Raw Response: "
    ];
    
    const randomIntro = wormIntros[Math.floor(Math.random() * wormIntros.length)];
    if (!text.startsWith(randomIntro.substring(0, 5))) {
      text = randomIntro + text;
    }
  }
  
  return text;
}
// import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default {
//   name: "removebg",
//   aliases: ["rmbg", "bgremove", "nobg", "transparent"],
//   description: "Remove background from image",
//   category: "ai",
  
//   async execute(sock, m, args, PREFIX) {
//     const jid = m.key.remoteJid;
//     const quoted = m.quoted;
    
//     // Check if there's a quoted message
//     if (!quoted) {
//       return sock.sendMessage(jid, {
//         text: `🎨 *BACKGROUND REMOVER*\n\n` +
//               `❌ Reply to an image message\n` +
//               `📌 *Usage:* Reply to an image with \`${PREFIX}removebg\`\n` +
//              ``
//       }, { quoted: m });
//     }

//     // Check if quoted message is an image
//     if (!quoted.message?.imageMessage) {
//       return sock.sendMessage(jid, {
//         text: `❌ *Not an Image*\n\n` +
//               `Please reply to an image message\n` +
//               `Only images (.jpg, .png) are supported`
//       }, { quoted: m });
//     }

//     try {
//       // Show processing status
//       const statusMsg = await sock.sendMessage(jid, {
//         text: `🔄 *Processing image...*\n` +
//             ``
//       }, { quoted: m });

//       // Download the image
//       const media = await sock.downloadAndSaveMediaMessage(
//         quoted.message,
//         'image'
//       );

//       if (!media) {
//         throw new Error('Failed to download image');
//       }

//       console.log(`[REMOVEBG] Image downloaded: ${media}`);

//       // Upload to temporary hosting service to get URL
//       let imageUrl = '';
//       try {
//         // Method 1: Use easyupload.io for temporary hosting
//         const uploadForm = new FormData();
//         const fileStream = fs.createReadStream(media);
//         uploadForm.append('file', fileStream);

//         const uploadResponse = await axios.post(
//           'https://easyupload.io/upload',
//           uploadForm,
//           {
//             headers: {
//               ...uploadForm.getHeaders(),
//               'User-Agent': 'Mozilla/5.0'
//             },
//             timeout: 15000
//           }
//         );

//         if (uploadResponse.data?.downloadLink) {
//           imageUrl = uploadResponse.data.downloadLink;
//         } else {
//           throw new Error('Upload failed');
//         }
//       } catch (uploadError) {
//         console.log('[REMOVEBG] Upload failed, trying alternative...');
        
//         // Method 2: Try different upload service
//         try {
//           const fileBuffer = fs.readFileSync(media);
//           const uploadResponse = await axios.post(
//             'https://api.imgbb.com/1/upload',
//             {
//               key: 'your-imgbb-api-key', // You need to get a free key from imgbb.com
//               image: fileBuffer.toString('base64')
//             },
//             { timeout: 15000 }
//           );
          
//           if (uploadResponse.data?.data?.url) {
//             imageUrl = uploadResponse.data.data.url;
//           } else {
//             throw new Error('Alternative upload failed');
//           }
//         } catch (imgbbError) {
//           console.log('[REMOVEBG] All upload services failed');
//           // Continue with local file approach
//         }
//       }

//       // If upload failed, use Keith API directly with file (if supported)
//       const apiUrl = imageUrl 
//         ? `https://apiskeith.vercel.app/ai/removebg?url=${encodeURIComponent(imageUrl)}`
//         : `https://apiskeith.vercel.app/ai/removebg`; // Some APIs accept form data

//       let removeBgResponse;
      
//       if (imageUrl) {
//         // Use URL method
//         removeBgResponse = await axios.get(apiUrl, {
//           timeout: 30000,
//           headers: {
//             'User-Agent': 'WolfBot/1.0'
//           }
//         });
//       } else {
//         // Try form data method
//         const form = new FormData();
//         const fileStream = fs.createReadStream(media);
//         form.append('image', fileStream);
        
//         removeBgResponse = await axios.post(
//           'https://apiskeith.vercel.app/ai/removebg',
//           form,
//           {
//             headers: {
//               ...form.getHeaders(),
//               'User-Agent': 'WolfBot/1.0'
//             },
//             timeout: 30000
//           }
//         );
//       }

//       if (!removeBgResponse.data?.status || !removeBgResponse.data.result) {
//         throw new Error('Background removal API failed');
//       }

//       const resultUrl = removeBgResponse.data.result;
      
//       console.log(`[REMOVEBG] Background removed: ${resultUrl}`);

//       // Send the result image
//       await sock.sendMessage(jid, {
//         image: { url: resultUrl },
//         caption: `🎨 *Background Removed*\n` +
//                 ``
//       }, { quoted: m });

//       // Update status
//       await sock.sendMessage(jid, {
//         text: `✅ *Background removed successfully!*\n` +
//         ``,
//         edit: statusMsg.key
//       });

//       // Clean up
//       if (fs.existsSync(media)) {
//         fs.unlinkSync(media);
//         console.log(`[REMOVEBG] Cleaned up: ${media}`);
//       }

//       // Send success reaction
//       await sock.sendMessage(jid, {
//         react: { text: '✅', key: m.key }
//       });

//     } catch (error) {
//       console.error('[REMOVEBG] Error:', error.message);
      
//       let errorMessage = `❌ *Background Removal Failed*\n\n`;
      
//       if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
//         errorMessage += `• Background removal service is unavailable\n`;
//         errorMessage += `• Try again later\n\n`;
//       } else if (error.response) {
//         if (error.response.status === 400) {
//           errorMessage += `• Invalid image format\n`;
//           errorMessage += `• Try a different image\n\n`;
//         } else if (error.response.status === 429) {
//           errorMessage += `• Rate limit exceeded\n`;
//           errorMessage += `• Please wait before trying again\n\n`;
//         } else if (error.response.status === 500) {
//           errorMessage += `• Background removal server error\n`;
//           errorMessage += `• Try a simpler image\n\n`;
//         } else {
//           errorMessage += `• API Error: ${error.response.status}\n\n`;
//         }
//       } else if (error.code === 'ETIMEDOUT') {
//         errorMessage += `• Processing timeout\n`;
//         errorMessage += `• Try again with smaller image\n\n`;
//       } else {
//         errorMessage += `• Error: ${error.message}\n\n`;
//       }
      
//       errorMessage += `💡 *Tips for better results:*\n`;
//       errorMessage += `• Use clear, high-contrast images\n`;
//       errorMessage += `• Images with solid backgrounds work best\n`;
//       errorMessage += `• Avoid busy/complex backgrounds\n`;
//       errorMessage += `• Good lighting helps\n\n`;
      
//       errorMessage += `📌 *Usage:* Reply to an image with \`${PREFIX}removebg\``;
      
//       await sock.sendMessage(jid, {
//         text: errorMessage
//       }, { quoted: m });
      
//       // Send error reaction
//       await sock.sendMessage(jid, {
//         react: { text: '❌', key: m.key }
//       });
//     }
//   }
// };























import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: "removebg",
  aliases: ["rmbg", "bgremove"],
  description: "Remove background from quoted image",
  category: "ai",
  
  async execute(sock, m, args, PREFIX, extra) {
    const jid = m.key.remoteJid;
    
    // ALTERNATIVE METHOD: Check if message is a reply
    if (!m.quoted) {
      return sock.sendMessage(jid, {
        text: `📌 Reply to an image first`
      }, { quoted: m });
    }
    
    // Get the quoted message properly
    const quotedMsg = m.quoted.message;
    
    // Check if it's an image - multiple ways
    const isImage = quotedMsg?.imageMessage || 
                   quotedMsg?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    
    if (!isImage) {
      return sock.sendMessage(jid, {
        text: `❌ Only image messages are supported`
      }, { quoted: m });
    }

    let filePath;
    try {
      // Show processing
      await sock.sendMessage(jid, {
        text: `🔄 Processing image...`
      }, { quoted: m });

      // Get image node - try different paths
      const imageNode = quotedMsg.imageMessage || 
                       quotedMsg.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
      
      if (!imageNode) {
        throw new Error('Could not get image data');
      }

      // Create temp directory
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Save image locally
      filePath = path.join(tempDir, `image_${Date.now()}.jpg`);
      
      // Download the image - use proper method
      const mediaBuffer = await sock.downloadMediaMessage({ 
        key: m.quoted.key, 
        message: { imageMessage: imageNode } 
      });
      
      if (!mediaBuffer) {
        throw new Error('Failed to download image');
      }
      
      fs.writeFileSync(filePath, mediaBuffer);
      
      console.log(`[REMOVEBG] Image saved: ${filePath} (${fs.statSync(filePath).size} bytes)`);

      // Upload to temporary host (simplified)
      const formData = new FormData();
      const fileStream = fs.createReadStream(filePath);
      formData.append('file', fileStream);
      
      const uploadResponse = await axios.post(
        'https://uguu.se/upload.php',
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 15000
        }
      );
      
      const imageUrl = uploadResponse.data?.files?.[0]?.url;
      if (!imageUrl) {
        throw new Error('Upload failed');
      }
      
      console.log(`[REMOVEBG] Uploaded to: ${imageUrl}`);

      // Call removebg API
      const apiResponse = await axios.get(
        `https://apiskeith.vercel.app/ai/removebg?url=${encodeURIComponent(imageUrl)}`,
        { timeout: 30000 }
      );

      if (!apiResponse.data?.status || !apiResponse.data.result) {
        throw new Error('API returned no result');
      }

      const resultUrl = apiResponse.data.result;
      console.log(`[REMOVEBG] Result URL: ${resultUrl}`);

      // Send the processed image
      await sock.sendMessage(jid, {
        image: { url: resultUrl },
        caption: `✅ Background removed`
      }, { quoted: m });

      // Clean up
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

    } catch (error) {
      console.error('[REMOVEBG] Error:', error.message);
      
      await sock.sendMessage(jid, {
        text: `❌ Failed: ${error.message}`
      }, { quoted: m });
      
    } finally {
      // Clean up temp file
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
    }
  }
};
import { downloadContentFromMessage, generateWAMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PassThrough } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Convert audio to voice note
async function toVN(inputBuffer) {
    return new Promise((resolve, reject) => {
        try {
            import('fluent-ffmpeg').then(ffmpeg => {
                const inStream = new PassThrough();
                inStream.end(inputBuffer);
                const outStream = new PassThrough();
                const chunks = [];

                ffmpeg.default(inStream)
                    .noVideo()
                    .audioCodec("libopus")
                    .format("ogg")
                    .audioBitrate("48k")
                    .audioChannels(1)
                    .audioFrequency(48000)
                    .on("error", reject)
                    .on("end", () => resolve(Buffer.concat(chunks)))
                    .pipe(outStream, { end: true });

                outStream.on("data", chunk => chunks.push(chunk));
            }).catch(() => resolve(inputBuffer));
        } catch {
            resolve(inputBuffer);
        }
    });
}

// 📌 Download message content to buffer
async function downloadToBuffer(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

// 📌 Build payload from quoted message
async function buildPayloadFromQuoted(quotedMessage) {
    if (quotedMessage.videoMessage) {
        const buffer = await downloadToBuffer(quotedMessage.videoMessage, 'video');
        return { 
            video: buffer, 
            caption: quotedMessage.videoMessage.caption || '',
            gifPlayback: quotedMessage.videoMessage.gifPlayback || false,
            mimetype: quotedMessage.videoMessage.mimetype || 'video/mp4'
        };
    }
    else if (quotedMessage.imageMessage) {
        const buffer = await downloadToBuffer(quotedMessage.imageMessage, 'image');
        return { 
            image: buffer, 
            caption: quotedMessage.imageMessage.caption || ''
        };
    }
    else if (quotedMessage.audioMessage) {
        const buffer = await downloadToBuffer(quotedMessage.audioMessage, 'audio');
        
        if (quotedMessage.audioMessage.ptt) {
            try {
                const audioVn = await toVN(buffer);
                return { 
                    audio: audioVn, 
                    mimetype: "audio/ogg; codecs=opus", 
                    ptt: true 
                };
            } catch {
                return { 
                    audio: buffer, 
                    mimetype: quotedMessage.audioMessage.mimetype || 'audio/mpeg',
                    ptt: true 
                };
            }
        } else {
            return { 
                audio: buffer, 
                mimetype: quotedMessage.audioMessage.mimetype || 'audio/mpeg',
                ptt: false 
            };
        }
    }
    else if (quotedMessage.stickerMessage) {
        const buffer = await downloadToBuffer(quotedMessage.stickerMessage, 'sticker');
        return { 
            sticker: buffer,
            mimetype: quotedMessage.stickerMessage.mimetype || 'image/webp'
        };
    }
    else if (quotedMessage.conversation || quotedMessage.extendedTextMessage?.text) {
        const textContent = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || '';
        return { text: textContent };
    }
    return null;
}

// 📌 Try multiple methods to send status
async function sendPersonalStatus(sock, content) {
    console.log('🔍 Attempting to send status with content type:', Object.keys(content)[0]);
    
    // Method 1: Try sendStatusUpdate if available (newer Baileys versions)
    if (typeof sock.sendStatusUpdate === 'function') {
        console.log('🔄 Trying Method 1: sock.sendStatusUpdate()');
        try {
            const result = await sock.sendStatusUpdate(content);
            console.log('✅ Method 1 succeeded');
            return result;
        } catch (error) {
            console.log('❌ Method 1 failed:', error.message);
        }
    }
    
    // Method 2: Try sendMessage with specific status flags
    console.log('🔄 Trying Method 2: sock.sendMessage() with status flag');
    try {
        // For text status
        if (content.text) {
            const result = await sock.sendMessage(
                sock.user.id,
                { 
                    text: content.text,
                    contextInfo: {
                        isForwarded: false,
                        forwardingScore: 0,
                        isStatus: true
                    }
                },
                { 
                    statusJidList: [sock.user.id]
                }
            );
            console.log('✅ Method 2 succeeded for text');
            return result;
        }
        
        // For image status
        if (content.image) {
            const result = await sock.sendMessage(
                sock.user.id,
                { 
                    image: content.image,
                    caption: content.caption || '',
                    contextInfo: {
                        isForwarded: false,
                        forwardingScore: 0,
                        isStatus: true
                    }
                },
                { 
                    statusJidList: [sock.user.id]
                }
            );
            console.log('✅ Method 2 succeeded for image');
            return result;
        }
        
        // For video status
        if (content.video) {
            const result = await sock.sendMessage(
                sock.user.id,
                { 
                    video: content.video,
                    caption: content.caption || '',
                    gifPlayback: content.gifPlayback || false,
                    contextInfo: {
                        isForwarded: false,
                        forwardingScore: 0,
                        isStatus: true
                    }
                },
                { 
                    statusJidList: [sock.user.id]
                }
            );
            console.log('✅ Method 2 succeeded for video');
            return result;
        }
        
    } catch (error) {
        console.log('❌ Method 2 failed:', error.message);
    }
    
    // Method 3: Try using WhatsApp Business API-like approach
    console.log('🔄 Trying Method 3: Direct relay message');
    try {
        const inside = await generateWAMessageContent(content, { upload: sock.waUploadToServer });
        const messageSecret = crypto.randomBytes(32);
        
        const m = generateWAMessageFromContent(
            sock.user.id,
            {
                messageContextInfo: { messageSecret },
                statusMessage: {
                    message: { 
                        ...inside, 
                        messageContextInfo: { messageSecret } 
                    }
                }
            },
            {}
        );
        
        await sock.relayMessage(sock.user.id, m.message, { messageId: m.key.id });
        console.log('✅ Method 3 succeeded');
        return m;
        
    } catch (error) {
        console.log('❌ Method 3 failed:', error.message);
        throw new Error(`All status update methods failed: ${error.message}`);
    }
}

// 📌 Get help text
function getHelpText(PREFIX = '.') {
    return `📱 *Personal Status Update Commands*\n\n` +
           `*Usage:*\n` +
           `• \`${PREFIX}tostatus\` Reply to video\n` +
           `• \`${PREFIX}tostatus\` Reply to image\n` +
           `• \`${PREFIX}tostatus\` Reply to audio\n` +
           `• \`${PREFIX}tostatus\` Reply to sticker\n` +
           `• \`${PREFIX}tostatus\` Reply to text\n` +
           `• \`${PREFIX}tostatus\` Your text here\n\n` +
           `*Notes:*\n` +
           `• Captions work with videos and images\n` +
           `• Status disappears after 24 hours\n` +
           `• Use responsibly to avoid rate limits\n\n` +
           `*Example:*\n` +
           `\`${PREFIX}tostatus Hello world! 🚀\``;
}

// 📌 Parse command and text
function parseCommand(messageText) {
    const commandRegex = /^[.!#/]?(tostatus|status|updatestatus|mystatus|ps|pstatus)\s*/i;
    const match = messageText.match(commandRegex);
    
    if (match) {
        const command = match[0].trim();
        const textAfterCommand = messageText.slice(match[0].length).trim();
        return { command, textAfterCommand };
    }
    
    return { command: null, textAfterCommand: messageText };
}

// 📌 Main command
export default {
    name: 'tostatus',
    aliases: ['status', 'updatestatus', 'mystatus', 'ps', 'pstatus'],
    description: 'Update your personal WhatsApp status',
    category: 'owner',
    ownerOnly: true,

    async execute(sock, m, args, PREFIX, extra) {
        try {
            const jid = m.key.remoteJid;
            const sender = m.key.participant || m.key.remoteJid;
            
            console.log(`[ToStatus] Command triggered by ${sender}`);
            
            // Get jidManager from extra parameter
            const { jidManager } = extra || {};
            
            if (!jidManager) {
                console.error('[ToStatus] jidManager not found!');
                await sock.sendMessage(jid, { 
                    text: `❌ System error: jidManager not available`
                }, { quoted: m });
                return;
            }
            
            // Owner check
            if (!jidManager.isOwner(m)) {
                console.log(`[ToStatus] Permission denied for ${sender}`);
                await sock.sendMessage(jid, { 
                    text: `❌ Owner Only Command!`
                }, { quoted: m });
                return;
            }
            
            console.log(`[ToStatus] Owner verified: ${sender}`);
            
            // Get message text
            const messageText = m.message?.conversation || 
                               m.message?.extendedTextMessage?.text || 
                               '';
            
            // Get quoted message
            const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            console.log(`[ToStatus] Message text: "${messageText}"`);
            console.log(`[ToStatus] Has quoted message: ${!!quotedMessage}`);
            
            // Show help if no content
            if (!quotedMessage && !messageText.trim()) {
                console.log('[ToStatus] Showing help');
                await sock.sendMessage(jid, { 
                    text: getHelpText(PREFIX)
                }, { quoted: m });
                return;
            }
            
            // Parse command and text
            const { command, textAfterCommand } = parseCommand(messageText);
            
            let payload = null;
            let mediaType = 'Text';
            
            // Handle quoted message
            if (quotedMessage) {
                console.log('[ToStatus] Processing quoted message');
                mediaType = detectMediaType(quotedMessage);
                payload = await buildPayloadFromQuoted(quotedMessage);
                
                // Add caption from command text
                if (textAfterCommand && payload && (payload.video || payload.image)) {
                    if (payload.video) {
                        payload.caption = textAfterCommand;
                    } else if (payload.image) {
                        payload.caption = textAfterCommand;
                    }
                }
                
                // Combine text
                if (mediaType === 'Text' && payload?.text && textAfterCommand) {
                    payload.text = payload.text + '\n\n' + textAfterCommand;
                }
            } 
            // Handle plain text command
            else if (messageText.trim()) {
                console.log('[ToStatus] Processing text-only status');
                mediaType = 'Text';
                
                if (!textAfterCommand && command) {
                    console.log('[ToStatus] Command without text');
                    await sock.sendMessage(jid, { 
                        text: getHelpText(PREFIX)
                    }, { quoted: m });
                    return;
                }
                
                if (textAfterCommand) {
                    payload = { text: textAfterCommand };
                } else {
                    payload = { text: messageText };
                }
            }
            
            if (!payload) {
                console.log('[ToStatus] No payload created');
                await sock.sendMessage(jid, { 
                    text: '❌ Could not process the message.'
                }, { quoted: m });
                return;
            }
            
            console.log(`[ToStatus] Payload type: ${mediaType}`);
            
            // Send processing message
            const statusMsg = await sock.sendMessage(jid, { 
                text: `🔄 Processing ${mediaType} status update...\nTrying multiple methods...`
            }, { quoted: m });
            
            // Try to send status
            console.log('[ToStatus] Attempting status update...');
            try {
                const result = await sendPersonalStatus(sock, payload);
                console.log('[ToStatus] Status update attempt completed');
                
                // Check if it actually worked
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                let successMsg = `✅ *Status Update Attempted*\n\n`;
                successMsg += `📱 Type: ${mediaType}\n`;
                
                if (payload.caption) {
                    successMsg += `📝 Caption: "${payload.caption}"\n`;
                }
                
                if (payload.text) {
                    const preview = payload.text.length > 100 ? 
                        payload.text.substring(0, 100) + '...' : payload.text;
                    successMsg += `📄 Content: "${preview}"\n`;
                }
                
                successMsg += `\n⏰ If successful, will disappear in 24 hours\n`;
                successMsg += `⚠️ Note: Status updates via API may not work consistently\n`;
                successMsg += `💡 Check your WhatsApp status tab to confirm`;
                
                await sock.sendMessage(jid, { 
                    text: successMsg,
                    edit: statusMsg.key
                });
                
            } catch (sendError) {
                console.error('[ToStatus] All methods failed:', sendError);
                
                let errorMsg = `❌ *Status Update Failed*\n\n`;
                errorMsg += `All update methods failed.\n\n`;
                errorMsg += `🔍 *Possible Reasons:*\n`;
                errorMsg += `• WhatsApp API restrictions\n`;
                errorMsg += `• Baileys library version incompatible\n`;
                errorMsg += `• Rate limiting by WhatsApp\n`;
                errorMsg += `• Status feature not implemented in this version\n\n`;
                errorMsg += `💡 *Try:*\n`;
                errorMsg += `• Update Baileys to latest version\n`;
                errorMsg += `• Check if sock.sendStatusUpdate exists\n`;
                errorMsg += `• Use WhatsApp Business API officially`;
                
                await sock.sendMessage(jid, { 
                    text: errorMsg,
                    edit: statusMsg.key
                });
            }
            
        } catch (error) {
            console.error('[ToStatus] Error:', error);
            
            try {
                await sock.sendMessage(m.key.remoteJid, { 
                    text: `❌ Error: ${error.message}`
                }, { quoted: m });
            } catch {
                console.error('[ToStatus] Could not send error message');
            }
        }
    }
};

// 📌 Detect media type helper
function detectMediaType(quotedMessage) {
    if (!quotedMessage) return 'Text';
    if (quotedMessage.videoMessage) return 'Video';
    if (quotedMessage.imageMessage) return 'Image';
    if (quotedMessage.audioMessage) return 'Audio';
    if (quotedMessage.stickerMessage) return 'Sticker';
    return 'Text';
}
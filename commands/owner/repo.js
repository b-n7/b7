









// import axios from 'axios';
// import moment from 'moment-timezone';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default {
//   name: "repo",
//   aliases: ["r", "sc", "source", "github", "git"],
//   description: "Shows WOLFBOT GitHub repository information",

//   async execute(sock, m, args, PREFIX) {
//     try {
//       const jid = m.key.remoteJid;
//       const sender = m.key.participant || m.key.remoteJid;
//       const pushname = m.pushName || "Unknown User";
//       const mentionTag = `@${sender.split('@')[0]}`;

//       // Fake contact function from your example
//       function createFakeContact(message) {
//         return {
//           key: {
//             participants: "0@s.whatsapp.net",
//             remoteJid: "status@broadcast",
//             fromMe: false,
//             id: "WOLFBOT"
//           },
//           message: {
//             contactMessage: {
//               vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:WOLFBOT\nitem1.TEL;waid=${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}:${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
//             }
//           },
//           participant: "0@s.whatsapp.net"
//         };
//       }

//       const fkontak = createFakeContact(m);

//       // Your GitHub repository
//       const owner = "Silent-Wolf7";
//       const repo = "Silentwolf";
//       const repoUrl = `https://github.com/${owner}/${repo}`;

//       try {
//         // Fetch real-time repo info from GitHub API
//         const { data } = await axios.get(
//           `https://api.github.com/repos/${owner}/${repo}`,
//           { 
//             timeout: 10000,
//             headers: { 
//               "User-Agent": "WolfBot",
//               "Accept": "application/vnd.github.v3+json"
//             } 
//           }
//         );

//         // Format the text exactly like your example but for WOLFBOT
//         let txt = `🔹  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n\n`;
//         txt += `🐺  *Name* : ${data.name || "WOLFBOT"}\n`;
//         txt += `🐺  *Watchers* : ${data.watchers_count || 0}\n`;
//         txt += `🐺  *Size* : ${(data.size / 1024).toFixed(2)} MB\n`;
//         txt += `🐺  *Last Updated* : ${moment(data.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
//         txt += `🐺  *REPO* : ${data.html_url || repoUrl}\n\n`;    
//         txt += `🐺  *Forks* : ${data.forks_count || 0}\n`;
//         txt += `🐺  *Stars* : ${data.stargazers_count || 0}\n`;
//         txt += `🐺  *Desc* : ${data.description || 'A powerful WhatsApp bot with amazing features.'}\n\n`;
//         txt += `Hey👋 ${mentionTag} _Thank you for choosing Silent Wolf, please fork and star the repository!_`;

//         // Try to use local image, fallback to default
//         let imgBuffer;
//         try {
//           const imgPath = path.join(__dirname, '../../assets/IMG-20251231-WA0084.jpg');
//           imgBuffer = fs.readFileSync(imgPath);
//         } catch (imgError) {
//           // If local image not found, use a placeholder or skip image
//           imgBuffer = null;
//         }

//         if (imgBuffer) {
//           // Send with image
//           await sock.sendMessage(jid, {
//             image: imgBuffer,
//             caption: txt,
//             contextInfo: {
//               mentionedJid: [sender],
//               forwardingScore: 1,
//               isForwarded: false,
//               forwardedNewsletterMessageInfo: {
//                 newsletterJid: '@newsletter',
//                 newsletterName: 'WOLFBOT Official',
//                 serverMessageId: -1
//               }
//             }
//           }, { quoted: fkontak });
//         } else {
//           // Send without image
//           await sock.sendMessage(jid, {
//             text: txt,
//             contextInfo: {
//               mentionedJid: [sender],
//               forwardingScore: 1,
//               isForwarded: false,
//               forwardedNewsletterMessageInfo: {
//                 newsletterJid: '@newsletter',
//                 newsletterName: 'WOLFBOT Official',
//                 serverMessageId: -1
//               }
//             }
//           }, { quoted: fkontak });
//         }

//         // Send success reaction
//         await sock.sendMessage(jid, {
//           react: { text: '✅', key: m.key }
//         });

//       } catch (apiError) {
//         console.error("GitHub API Error:", apiError);
        
//         // Fallback static data
//         const fallbackText = `🔹  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n\n` +
//           `🐺  *Name* : WOLFBOT\n` +
//           `🐺  *Watchers* : 491\n` +
//           `🐺  *Size* : 1.62 MB\n` +
//           `🐺  *Last Updated* : 16/01/26 - 05:04:15\n` +
//           `🐺  *REPO* : ${repoUrl}\n\n` +    
//           `🐺  *Forks* : 25\n` +
//           `🐺  *Stars* : 150\n` +
//           `🐺  *Desc* : A powerful WhatsApp bot with amazing features.\n\n` +
//           `Hey👋 ${mentionTag} _Thank you for choosing Silent Wolf, please fork and star the repository!_`;

//         await sock.sendMessage(jid, {
//           text: fallbackText,
//           contextInfo: {
//             mentionedJid: [sender],
//             forwardingScore: 1,
//             isForwarded: false
//           }
//         }, { quoted: fkontak });

//         // Send error reaction
//         await sock.sendMessage(jid, {
//           react: { text: '⚠️', key: m.key }
//         });
//       }

//     } catch (err) {
//       console.error("General Error:", err);
      
//       // Minimal fallback
//       const simpleText = `🔹  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n\n` +
//         `🔸  *Name* : WOLFBOT\n` +
//         `🔸  *REPO* : https://github.com/Silent-Wolf7/Silentwolf\n\n` +
//         `Hey👋 @${(m.key.participant || m.key.remoteJid).split('@')[0]} _Thank you for choosing Silent Wolf!_`;

//       await sock.sendMessage(m.key.remoteJid, {
//         text: simpleText,
//         contextInfo: {
//           mentionedJid: [m.key.participant || m.key.remoteJid]
//         }
//       }, { quoted: m });
//     }
//   },
// };




















import axios from 'axios';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: "repo",
  aliases: ["r", "sc", "source", "github", "git"],
  description: "Shows WOLFBOT GitHub repository information",

  async execute(sock, m, args, PREFIX) {
    try {
      const jid = m.key.remoteJid;
      const sender = m.key.participant || m.key.remoteJid;
      const pushname = m.pushName || "Unknown User";
      const mentionTag = `@${sender.split('@')[0]}`;

      // Fake contact function from your example
      function createFakeContact(message) {
        return {
          key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "WOLFBOT"
          },
          message: {
            contactMessage: {
              vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:WOLFBOT\nitem1.TEL;waid=${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}:${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
          },
          participant: "0@s.whatsapp.net"
        };
      }

      const fkontak = createFakeContact(m);

      // Your GitHub repository
      const owner = "Silent-Wolf7";
      const repo = "Silentwolf";
      const repoUrl = `https://github.com/${owner}/${repo}`;

      try {
        // Fetch real-time repo info from GitHub API
        const { data } = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}`,
          { 
            timeout: 10000,
            headers: { 
              "User-Agent": "WolfBot",
              "Accept": "application/vnd.github.v3+json"
            } 
          }
        );

        // Get GitHub owner avatar for thumbnail
        const thumbnailUrl = data.owner?.avatar_url || "https://avatars.githubusercontent.com/u/10639145";

        // Format the text exactly like your example but for WOLFBOT
        let txt = `◎  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n`;
        txt += `◎ *Name* : ${data.name || "WOLFBOT"}\n`;
        txt += `◎ *Watchers* : ${data.watchers_count || 0}\n`;
        txt += `◎ *Size* : ${(data.size / 1024).toFixed(2)} MB\n`;
        txt += `◎ *Last Updated* : ${moment(data.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
        txt += `◎ *REPO* : ${data.html_url || repoUrl}\n\n`;    
        txt += `◎ *Forks* : ${data.forks_count || 0}\n`;
        txt += `◎ *Stars* : ${data.stargazers_count || 0}\n`;
        txt += `◎ *Desc* : ${data.description || 'Official Apex'}\n\n`;
        txt += `Hey👋 ${mentionTag} _Thank you for choosing Silent Wolf, please fork and star the repository!_`;

        // Send text message with externalAdReply for thumbnail
        await sock.sendMessage(jid, {
          text: txt,
          contextInfo: {
            mentionedJid: [sender],
            externalAdReply: {
              title: "🐺 WOLFBOT Repository",
              body: `Stars: ${data.stargazers_count || 0} • Forks: ${data.forks_count || 0}`,
              mediaType: 1,
              thumbnailUrl: thumbnailUrl,
              sourceUrl: repoUrl,
              mediaUrl: repoUrl,
              renderLargerThumbnail: true,
              showAdAttribution: true
            },
            forwardingScore: 1,
            isForwarded: false
          }
        }, { quoted: fkontak });

        // Send success reaction
        await sock.sendMessage(jid, {
          react: { text: '✅', key: m.key }
        });

      } catch (apiError) {
        console.error("GitHub API Error:", apiError);
        
        // Fallback static data
        const fallbackText = `◎  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n\n` +
          `◎ *Name* : WOLFBOT\n` +
          `◎ *Watchers* : 491\n` +
          `◎ *Size* : 1.62 MB\n` +
          `◎ *Last Updated* : 16/01/26 - 05:04:15\n` +
          `◎ *REPO* : ${repoUrl}\n\n` +    
          `◎ *Forks* : 25\n` +
          `◎ *Stars* : 150\n` +
          `◎ *Desc* : A powerful WhatsApp bot with amazing features.\n\n` +
          `Hey👋 ${mentionTag} _Thank you for choosing Silent Wolf, please fork and star the repository!_`;

        await sock.sendMessage(jid, {
          text: fallbackText,
          contextInfo: {
            mentionedJid: [sender],
            externalAdReply: {
              title: "🐺 WOLFBOT Repository",
              body: "GitHub • Silent-Wolf7/Silentwolf",
              mediaType: 1,
              thumbnailUrl: "https://avatars.githubusercontent.com/u/10639145",
              sourceUrl: repoUrl,
              mediaUrl: repoUrl,
              renderLargerThumbnail: true
            },
            forwardingScore: 1,
            isForwarded: false
          }
        }, { quoted: fkontak });

        // Send error reaction
        await sock.sendMessage(jid, {
          react: { text: '⚠️', key: m.key }
        });
      }

    } catch (err) {
      console.error("General Error:", err);
      
      // Minimal fallback
      const simpleText = `🔹  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n\n` +
        `🐺  *Name* : WOLFBOT\n` +
        `🐺  *REPO* : https://github.com/Silent-Wolf7/Silentwolf\n\n` +
        `Hey👋 @${(m.key.participant || m.key.remoteJid).split('@')[0]} _Thank you for choosing Silent Wolf!_`;

      await sock.sendMessage(m.key.remoteJid, {
        text: simpleText,
        contextInfo: {
          mentionedJid: [m.key.participant || m.key.remoteJid],
          externalAdReply: {
            title: "🐺 WOLFBOT Repository",
            body: "GitHub Repository",
            mediaType: 1,
            thumbnailUrl: "https://avatars.githubusercontent.com/u/10639145",
            sourceUrl: "https://github.com/Silent-Wolf7/Silentwolf"
          }
        }
      }, { quoted: m });
    }
  },
};
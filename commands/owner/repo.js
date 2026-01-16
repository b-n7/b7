

















// import axios from "axios";

// export default {
//   name: "repo",
//   description: "Shows bot GitHub repository",

//   async execute(sock, m, args) {
//     try {
//       const jid = m.key.remoteJid;
//       const sender = m.key.participant || m.key.remoteJid;

//       // 🔧 Updated with your GitHub repository
//       const owner = "777Wolf-dot";
//       const repo = "Silent-Wolf--Bot";
//       const repoUrl = `https://github.com/${owner}/${repo}`;

//       // 🌐 Fetch real-time repo info from GitHub API
//       const { data } = await axios.get(
//         `https://api.github.com/repos/${owner}/${repo}`,
//         { 
//           headers: { 
//             "User-Agent": "Silent-Wolf-Bot",
//             "Accept": "application/vnd.github.v3+json"
//           } 
//         }
//       );

//       // 📊 Fetch additional statistics for real-time data
//       let commitsCount = 0;
//       let issuesCount = 0;
//       let pullRequestsCount = 0;
      
//       try {
//         // Get commits count
//         const commitsRes = await axios.get(
//           `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
//           { headers: { "User-Agent": "Silent-Wolf-Bot" } }
//         );
//         // Extract from Link header if available
//         if (commitsRes.headers.link) {
//           const lastPageMatch = commitsRes.headers.link.match(/page=(\d+)>; rel="last"/);
//           commitsCount = lastPageMatch ? parseInt(lastPageMatch[1]) : 0;
//         }
//       } catch (e) {
//         commitsCount = 0;
//       }

//       try {
//         // Get open issues count
//         const issuesRes = await axios.get(
//           `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=1`,
//           { headers: { "User-Agent": "Silent-Wolf-Bot" } }
//         );
//         if (issuesRes.headers.link) {
//           const lastPageMatch = issuesRes.headers.link.match(/page=(\d+)>; rel="last"/);
//           issuesCount = lastPageMatch ? parseInt(lastPageMatch[1]) : 0;
//         }
//       } catch (e) {
//         issuesCount = 0;
//       }

//       try {
//         // Get open pull requests count
//         const prRes = await axios.get(
//           `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=1`,
//           { headers: { "User-Agent": "Silent-Wolf-Bot" } }
//         );
//         if (prRes.headers.link) {
//           const lastPageMatch = prRes.headers.link.match(/page=(\d+)>; rel="last"/);
//           pullRequestsCount = lastPageMatch ? parseInt(lastPageMatch[1]) : 0;
//         }
//       } catch (e) {
//         pullRequestsCount = 0;
//       }

//       // Format date
//       const updatedDate = new Date(data.updated_at).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });

//       const text = `
// 🐺*SILENT WOLF BOT REPOSITORY*

// 📦 *Repository:* ${data.name}
// ⭐ *Stars:* ${data.stargazers_count}
// 🍴 *Forks:* ${data.forks_count}
// 👁️ *Watchers:* ${data.watchers_count}
// 🔗 *Repository URL:* ${repoUrl}

// 👋 @${sender.split("@")[0]}, support the project by giving it a ⭐ star!
//       `.trim();

//       await sock.sendMessage(
//         jid,
//         {
//           text,
//           contextInfo: {
//             mentionedJid: [sender],
//             externalAdReply: {
//               title: "🐺 Silent Wolf Bot",
//               body: data.description || "WhatsApp Bot Repository",
//               mediaType: 1,
//               thumbnailUrl: data.owner.avatar_url,
//               sourceUrl: repoUrl,
//               renderLargerThumbnail: true,
//               showAdAttribution: false
//             },
//           },
//         },
//         { quoted: m }
//       );

//       console.log("✅ Repo command executed successfully - Real-time data fetched");

//     } catch (err) {
//       console.error("❌ Repo command error:", err.message || err);
      
//       // Fallback to basic repo info if API fails
//       const fallbackText = `
// 🐺 *SILENT WOLF BOT REPOSITORY* 🐺

// 📦 *Repository:* Silent-Wolf--Bot
// 👤 *Owner:* 777Wolf-dot
// 🔗 *GitHub:* https://github.com/777Wolf-dot/Silent-Wolf--Bot.git

// ⭐ Star the repository to support development!
// 🍴 Fork it to customize for your needs!

// Note: Could not fetch real-time statistics.
//       `.trim();

//       await sock.sendMessage(
//         m.key.remoteJid,
//         { 
//           text: fallbackText,
//           contextInfo: {
//             externalAdReply: {
//               title: "Silent Wolf Bot",
//               body: "WhatsApp Bot Repository",
//               mediaType: 1,
//               sourceUrl: "https://github.com/777Wolf-dot/Silent-Wolf--Bot.git",
//               renderLargerThumbnail: true
//             }
//           }
//         },
//         { quoted: m }
//       );
//     }
//   },
// };

















import axios from "axios";

export default {
  name: "repo",
  aliases: ["r", "sc", "source", "github", "git"],
  description: "Shows bot GitHub repository information",

  async execute(sock, m, args, PREFIX) {
    try {
      const jid = m.key.remoteJid;
      const sender = m.key.participant || m.key.remoteJid;

      // 🔧 Updated with your NEW GitHub repository
      const owner = "Silent-Wolf7";
      const repo = "Silentwolf";
      const repoUrl = `https://github.com/${owner}/${repo}`;

      // Send initial status
      const statusMsg = await sock.sendMessage(jid, { 
        text: `🔍 *Fetching GitHub Repository*\n` +
              `🌐 *Connecting to GitHub API...*\n` +
              `📊 *Gathering real-time statistics...*`
      }, { quoted: m });

      try {
        // 🌐 Fetch real-time repo info from GitHub API
        const { data } = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}`,
          { 
            timeout: 15000,
            headers: { 
              "User-Agent": "Silent-Wolf-Bot",
              "Accept": "application/vnd.github.v3+json"
            } 
          }
        );

        console.log(`✅ [REPO] GitHub API success for ${owner}/${repo}`);

        // Update status
        await sock.sendMessage(jid, {
          text: `🔍 *Fetching GitHub Repository*\n` +
                `🌐 *Connecting...* ✅\n` +
                `📊 *Processing statistics...*\n` +
                `⚡ *Formatting repository info...*`,
          edit: statusMsg.key
        });

        // 📊 Fetch additional statistics (optimized with parallel requests)
        let [commitsCount, issuesCount, starsCount, forksCount] = [0, 0, data.stargazers_count || 0, data.forks_count || 0];
        
        // Format dates
        const createdDate = new Date(data.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        
        const updatedDate = new Date(data.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        // Get languages used
        let languages = [];
        try {
          const langRes = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/languages`,
            { 
              timeout: 10000,
              headers: { "User-Agent": "Silent-Wolf-Bot" } 
            }
          );
          languages = Object.keys(langRes.data || {}).slice(0, 5);
        } catch (e) {
          console.log("⚠️ Could not fetch languages");
        }

        // Check if repository is private
        const isPrivate = data.private ? "🔒 Private" : "🔓 Public";
        
        // Get license info
        const licenseName = data.license?.name || "Not specified";
        
        // Get size (converted to MB/KB)
        const sizeKB = data.size || 0;
        const sizeDisplay = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

        // Format main text
        const text = `
🐺 *SILENT WOLF BOT REPOSITORY*

📁 *Repository:* ${data.name || repo}
👤 *Owner:* ${owner}
🌐 *Status:* ${isPrivate}
📄 *License:* ${licenseName}
📦 *Size:* ${sizeDisplay}

📊 *Statistics:*
⭐ Stars: ${starsCount}
🍴 Forks: ${forksCount}
👁️ Watchers: ${data.watchers_count || 0}
📝 Open Issues: ${data.open_issues_count || 0}

📅 *Timeline:*
🕐 Created: ${createdDate}
🔄 Updated: ${updatedDate}

💻 *Main Languages:* ${languages.length > 0 ? languages.join(", ") : "Not detected"}

📖 *Description:* ${data.description || "WhatsApp Bot built with Node.js"}

🔗 *Repository URL:* ${repoUrl}

👋 *Support Development:*
• ⭐ Star the repository
• 🍴 Fork for customization
• 📝 Report issues
• 🔄 Contribute pull requests

💡 *Quick Commands:*
• \`${PREFIX}help\` - Show all commands
• \`${PREFIX}owner\` - Contact developer
• \`${PREFIX}donate\` - Support project

🚀 *Keep the wolf running!*
        `.trim();

        // Get owner avatar for thumbnail
        let thumbnailUrl = data.owner?.avatar_url || "https://avatars.githubusercontent.com/u/10639145";

        await sock.sendMessage(
          jid,
          {
            text,
            contextInfo: {
              mentionedJid: [sender],
              externalAdReply: {
                title: "🐺 Silent Wolf Bot v2",
                body: `${data.name || "Silent Wolf Bot"} • ${starsCount} stars • ${forksCount} forks`,
                mediaType: 1,
                thumbnailUrl: thumbnailUrl,
                sourceUrl: repoUrl,
                mediaUrl: repoUrl,
                renderLargerThumbnail: true
              },
            },
          },
          { 
            quoted: m,
            edit: statusMsg.key 
          }
        );

        console.log(`✅ Repo command executed - ${owner}/${repo} (${starsCount} stars, ${forksCount} forks)`);

      } catch (apiError) {
        console.error("❌ GitHub API error:", apiError.message);
        
        // Fallback to static repository info
        await sock.sendMessage(jid, {
          text: `🐺 *SILENT WOLF BOT REPOSITORY* 🐺

📁 *New Repository:* Silentwolf
👤 *Owner:* Silent-Wolf7
🔗 *GitHub URL:* https://github.com/Silent-Wolf7/Silentwolf.git

📖 *Description:* WhatsApp Bot with advanced features, AI integration, and media tools.

🚀 *Features:*
• 🤖 Multiple AI models (GPT, Claude, Bard, DeepSeek)
• 📥 Media downloaders (YouTube, Spotify, images)
• 🎵 Audio/video processing
• 🔍 Web search capabilities
• 🛠️ Utility commands

⚡ *Quick Start:*
1. Star ⭐ the repository
2. Fork 🍴 to customize
3. Deploy to your server
4. Configure with your credentials

🔧 *Tech Stack:* Node.js, Baileys, Express, Axios

💡 *Support:*
• Report issues on GitHub
• Contribute via pull requests
• Share with other developers

🔤 *Aliases:* ${PREFIX}repo, ${PREFIX}r, ${PREFIX}sc, ${PREFIX}source, ${PREFIX}github

🐺 *Join the pack, support open source!*`,
          contextInfo: {
            mentionedJid: [sender],
            externalAdReply: {
              title: "Silent Wolf Bot v2",
              body: "New GitHub Repository • Node.js WhatsApp Bot",
              mediaType: 1,
              sourceUrl: "https://github.com/Silent-Wolf7/Silentwolf.git",
              thumbnailUrl: "https://avatars.githubusercontent.com/u/10639145",
              renderLargerThumbnail: true
            }
          }
        }, { 
          quoted: m,
          edit: statusMsg.key 
        });
      }

    } catch (err) {
      console.error("❌ [REPO] Command error:", err.message || err);
      
      // Final fallback - minimal repo info
      const fallbackText = `
🐺 *SILENT WOLF BOT*

🔗 *GitHub Repository:*
https://github.com/Silent-Wolf7/Silentwolf.git

👤 *Owner:* Silent-Wolf7
📁 *Repo:* Silentwolf

🔤 *Aliases:* ${PREFIX}repo, ${PREFIX}r, ${PREFIX}sc

📲 *Bot Status:* Operational
🔄 *Last Updated:* Today

⭐ *Support by starring the repo!*

Error: Could not fetch detailed repository information.
      `.trim();

      await sock.sendMessage(
        m.key.remoteJid,
        { 
          text: fallbackText,
          contextInfo: {
            externalAdReply: {
              title: "Silent Wolf Bot",
              body: "GitHub Repository",
              mediaType: 1,
              sourceUrl: "https://github.com/Silent-Wolf7/Silentwolf.git"
            }
          }
        },
        { quoted: m }
      );
    }
  },
};
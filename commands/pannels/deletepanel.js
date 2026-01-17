// import axios from "axios";

// export default {
//   name: "deleteall",
//   aliases: ["nuke", "purge", "deleteservers"],
//   category: "Admin",
//   description: "Delete ALL servers from Pterodactyl panel (DANGEROUS)",
  
//   async execute(sock, m, args, PREFIX) {
//     const jid = m.key.remoteJid;
//     const sender = m.key.participant || m.key.remoteJid;
//     const userId = sender.split("@")[0];

//     // Pterodactyl API configuration
//     const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
//     const PTERODACTYL_PANEL_URL = "https://panel.yourdomain.com"; // Replace with your panel URL
//     const ADMIN_USER_ID = "254703397679"; // Your user ID for confirmation

//     // Check if user is authorized
//     if (userId !== ADMIN_USER_ID) {
//       await sock.sendMessage(jid, { 
//         text: `❌ *UNAUTHORIZED*\n\nOnly the bot owner can use this command.\n\nOwner ID: ${ADMIN_USER_ID}\nYour ID: ${userId}`
//       }, { quoted: m });
//       return;
//     }

//     // Double confirmation for safety
//     if (!args.includes('--confirm') && !args.includes('-y')) {
//       await sock.sendMessage(jid, { 
//         text: `⚠️ *DANGEROUS COMMAND - CONFIRMATION REQUIRED*\n\nThis command will delete ALL servers from your Pterodactyl panel.\n\n` +
//               `*This action is irreversible!* All server data will be permanently deleted.\n\n` +
//               `To proceed, type:\n\`${PREFIX}deleteall --confirm\`\n\n` +
//               `Or use:\n\`${PREFIX}nuke -y\`\n\n` +
//               `🔒 *Safety Note:* Make sure you have backups before proceeding.`
//       }, { quoted: m });
//       return;
//     }

//     try {
//       // Send initial status
//       const statusMsg = await sock.sendMessage(jid, { 
//         text: `🔍 *Fetching server list...*\n` +
//               `⚠️ *Preparing to delete ALL servers...*\n` +
//               `⏳ *This may take several minutes...*`
//       }, { quoted: m });

//       // Fetch all servers
//       const response = await axios({
//         method: 'GET',
//         url: `${PTERODACTYL_PANEL_URL}/api/application/servers`,
//         headers: {
//           'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         timeout: 30000
//       });

//       const servers = response.data.data || [];
      
//       if (servers.length === 0) {
//         await sock.sendMessage(jid, { 
//           text: `✅ *No servers found*\n\nThere are no servers to delete on your Pterodactyl panel.`,
//           edit: statusMsg.key 
//         });
//         return;
//       }

//       await sock.sendMessage(jid, { 
//         text: `🔍 *Found:* ${servers.length} servers\n` +
//               `⚠️ *Starting deletion process...*\n` +
//               `🗑️ *Deleting servers...*`,
//         edit: statusMsg.key 
//       });

//       const deletedServers = [];
//       const failedServers = [];
      
//       // Delete servers one by one
//       for (let i = 0; i < servers.length; i++) {
//         const server = servers[i];
//         const serverId = server.attributes.id;
//         const serverName = server.attributes.name;
        
//         try {
//           // Update progress
//           await sock.sendMessage(jid, { 
//             text: `🗑️ *Deleting Server ${i + 1}/${servers.length}*\n` +
//                   `📛 *Name:* ${serverName}\n` +
//                   `🆔 *ID:* ${serverId}\n` +
//                   `⏳ *Progress:* ${Math.round(((i + 1) / servers.length) * 100)}%`
//           });
          
//           // Delete the server
//           await axios({
//             method: 'DELETE',
//             url: `${PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}`,
//             headers: {
//               'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             },
//             timeout: 15000
//           });
          
//           deletedServers.push({ name: serverName, id: serverId });
//           console.log(`✅ Deleted server: ${serverName} (${serverId})`);
          
//           // Small delay to avoid rate limiting
//           if (i < servers.length - 1) {
//             await new Promise(resolve => setTimeout(resolve, 1000));
//           }
          
//         } catch (serverError) {
//           console.error(`❌ Failed to delete server ${serverName}:`, serverError.message);
//           failedServers.push({ name: serverName, id: serverId, error: serverError.message });
//         }
//       }

//       // Final report
//       let reportText = `✅ *SERVER DELETION COMPLETE*\n\n`;
//       reportText += `📊 *Summary:*\n`;
//       reportText += `✅ *Deleted:* ${deletedServers.length} servers\n`;
//       reportText += `❌ *Failed:* ${failedServers.length} servers\n`;
//       reportText += `📈 *Total:* ${servers.length} servers\n\n`;
      
//       if (deletedServers.length > 0) {
//         reportText += `🗑️ *Deleted Servers:*\n`;
//         deletedServers.slice(0, 10).forEach(server => {
//           reportText += `• ${server.name} (${server.id})\n`;
//         });
//         if (deletedServers.length > 10) {
//           reportText += `• ...and ${deletedServers.length - 10} more\n`;
//         }
//         reportText += `\n`;
//       }
      
//       if (failedServers.length > 0) {
//         reportText += `⚠️ *Failed to Delete:*\n`;
//         failedServers.slice(0, 5).forEach(server => {
//           reportText += `• ${server.name} - ${server.error.substring(0, 50)}...\n`;
//         });
//         reportText += `\n`;
//       }
      
//       reportText += `🔄 *Panel Status:* All selected servers have been processed.\n`;
//       reportText += `📋 *Note:* Check Pterodactyl panel for full details.\n\n`;
//       reportText += `🔧 *To create new servers:* Use ${PREFIX}create or panel web interface.`;

//       await sock.sendMessage(jid, { 
//         text: reportText,
//         edit: statusMsg.key 
//       });

//       console.log(`✅ DeleteAll command completed: ${deletedServers.length} deleted, ${failedServers.length} failed`);

//     } catch (error) {
//       console.error('❌ [DELETEALL] ERROR:', error.message);
      
//       let errorMessage = `❌ *DELETE ALL COMMAND FAILED*\n\n`;
      
//       if (error.code === 'ECONNREFUSED') {
//         errorMessage += `• Cannot connect to Pterodactyl panel\n`;
//         errorMessage += `• Check panel URL and network\n`;
//       } else if (error.response?.status === 401) {
//         errorMessage += `• Invalid API key\n`;
//         errorMessage += `• Check PTERODACTYL_API_KEY\n`;
//       } else if (error.response?.status === 403) {
//         errorMessage += `• Permission denied\n`;
//         errorMessage += `• API key lacks delete permissions\n`;
//       } else if (error.response?.status === 404) {
//         errorMessage += `• Panel URL not found\n`;
//         errorMessage += `• Check PTERODACTYL_PANEL_URL\n`;
//       } else {
//         errorMessage += `• Error: ${error.message}\n`;
//       }
      
//       errorMessage += `\n🔧 *Troubleshooting:*\n`;
//       errorMessage += `1. Check panel is running\n`;
//       errorMessage += `2. Verify API key permissions\n`;
//       errorMessage += `3. Check network connection\n`;
//       errorMessage += `4. Try manual deletion via panel\n`;
      
//       await sock.sendMessage(jid, { 
//         text: errorMessage
//       }, { quoted: m });
//     }
//   }
// };
import axios from "axios";

export default {
  name: "paneltest",
  aliases: ["ptest", "wolfhosttest"],
  category: "Admin",
  description: "Test connection to Wolf Host Pterodactyl panel",
  
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;

    const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
    const testUrls = [
      "https://wolf-host.xcasper.site/api",
      "https://wolf-host.xcasper.site",
      "https://wolf-host.xcasper.site:8080/api",
      "https://wolf-host.xcasper.site:8443/api"
    ];

    try {
      const statusMsg = await sock.sendMessage(jid, { 
        text: `🔧 *Testing Wolf Host Panel Connections...*`
      }, { quoted: m });

      let results = "";
      
      for (const url of testUrls) {
        try {
          const startTime = Date.now();
          const response = await axios({
            method: 'GET',
            url: `${url}/application/servers`,
            headers: {
              'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
              'Accept': 'application/json'
            },
            timeout: 10000,
            validateStatus: null // Accept all status codes
          });
          
          const latency = Date.now() - startTime;
          results += `✅ *${url}*\n`;
          results += `   📡 Status: ${response.status}\n`;
          results += `   ⏱️ Latency: ${latency}ms\n`;
          
          if (response.status === 200) {
            results += `   🖥️ Servers: ${response.data?.data?.length || 0}\n`;
          }
          
          results += `\n`;
          
        } catch (err) {
          results += `❌ *${url}*\n`;
          results += `   ⚠️ Error: ${err.message}\n\n`;
        }
      }

      await sock.sendMessage(jid, { 
        text: `🔧 *WOLF HOST PANEL TEST*\n\n${results}\n` +
              `📋 *Best URL:* Use the one with ✅ status\n` +
              `🔑 *API Key:* ${PTERODACTYL_API_KEY.substring(0, 10)}...`,
        edit: statusMsg.key 
      });

    } catch (error) {
      await sock.sendMessage(jid, { 
        text: `❌ Test failed: ${error.message}`
      }, { quoted: m });
    }
  }
};
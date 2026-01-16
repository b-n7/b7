import axios from "axios";
import yts from "yt-search";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Working APIs based on your Keith pattern
const apis = {
  keith: {
    search: async (query) => {
      try {
        const response = await axios.get(
          `https://apiskeith.vercel.app/search/yts?query=${encodeURIComponent(query)}`,
          { timeout: 10000 }
        );
        return response.data?.result || [];
      } catch (error) {
        console.error("Keith search error:", error.message);
        return [];
      }
    },
    downloadAudio: async (url) => {
      try {
        const response = await axios.get(
          `https://apiskeith.vercel.app/download/audio?url=${encodeURIComponent(url)}`,
          { timeout: 15000 }
        );
        return response.data?.result;
      } catch (error) {
        console.error("Keith download error:", error.message);
        return null;
      }
    }
  },
  
  y2mate: {
    downloadAudio: async (url) => {
      try {
        const response = await axios.get(
          `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(url)}&type=mp3`,
          { timeout: 15000 }
        );
        return response.data?.result?.audio?.url;
      } catch (error) {
        console.error("Y2Mate error:", error.message);
        return null;
      }
    }
  },
  
  tomp3: {
    downloadAudio: async (url) => {
      try {
        const endpoints = [
          `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(url)}&type=mp3`,
          `https://ytdl.sam-powers.workers.dev/?url=${encodeURIComponent(url)}&type=audio`,
          `https://yt5s.com/api/ajaxSearch?q=${encodeURIComponent(url)}&vt=home`
        ];
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(endpoint, { timeout: 10000 });
            if (response.data?.result?.audio?.url) return response.data.result.audio.url;
            if (response.data?.url) return response.data.url;
          } catch (e) {
            continue;
          }
        }
        return null;
      } catch (error) {
        console.error("Tomp3 error:", error.message);
        return null;
      }
    }
  }
};

export default {
  name: "song",
  aliases: ["music", "audio"],
  category: "Downloader",
  description: "Download YouTube audio as audio messages",
  
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    const quoted = m.quoted;
    let searchQuery = "";
    
    // Get search query
    if (args.length > 0) {
      searchQuery = args.join(" ");
    } else if (quoted && quoted.text) {
      searchQuery = quoted.text;
    } else {
      await sock.sendMessage(jid, { 
        text: `🎵 *Song Downloader*\n\n` +
              `💡 *Usage:*\n` +
              `• \`${PREFIX}song your song name\`\n` +
              `• \`${PREFIX}song YouTube URL\`\n` +
              `📌 *Examples:*\n` +
              `• \`${PREFIX}song Home by NF\`\n` +
              `• \`${PREFIX}song https://youtube.com/watch?v=xxx\`\n` +
             ``
      }, { quoted: m });
      return;
    }

    console.log(`🎵 [SONG] Searching: "${searchQuery}"`);

    try {
      // Send initial status
      const statusMsg = await sock.sendMessage(jid, { 
        text: `🔍 *Searching:* "${searchQuery}"` 
      }, { quoted: m });

      // Determine if URL or search
      let videoUrl = '';
      let videoTitle = '';
      let thumbnail = '';
      let videoId = '';

      if (searchQuery.match(/(youtube\.com|youtu\.be)/i)) {
        videoUrl = searchQuery;
        videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
        if (!videoId) {
          await sock.sendMessage(jid, { 
            text: "❌ Invalid YouTube URL format.",
            edit: statusMsg.key 
          });
          return;
        }
        videoTitle = "YouTube Audio";
        thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      } else {
        // Search for video using yt-search
        try {
          const { videos } = await yts(searchQuery);
          if (!videos || videos.length === 0) {
            // Try Keith search as fallback
            const keithResults = await apis.keith.search(searchQuery);
            if (keithResults && keithResults.length > 0) {
              videoUrl = keithResults[0].url;
              videoTitle = keithResults[0].title;
              thumbnail = keithResults[0].thumbnail;
              videoId = keithResults[0].videoId || keithResults[0].id;
            } else {
              await sock.sendMessage(jid, { 
                text: `❌ No results found for "${searchQuery}"`,
                edit: statusMsg.key 
              });
              return;
            }
          } else {
            videoUrl = videos[0].url;
            videoTitle = videos[0].title;
            thumbnail = videos[0].thumbnail;
            videoId = videos[0].videoId;
          }
        } catch (error) {
          console.error("Search error:", error);
          await sock.sendMessage(jid, { 
            text: `❌ Search failed: ${error.message}`,
            edit: statusMsg.key 
          });
          return;
        }
      }

      console.log(`🎵 [SONG] Selected: "${videoTitle}" | URL: ${videoUrl}`);

      await sock.sendMessage(jid, { 
        text: `🔍 *Found:* "${videoTitle}" ✅\n⬇️ *Downloading...*`,
        edit: statusMsg.key 
      });

      // Try multiple download sources with priority
      let downloadUrl = null;
      let apiUsed = "";
      
      // Priority 1: Keith API
      downloadUrl = await apis.keith.downloadAudio(videoUrl);
      if (downloadUrl) apiUsed = "Keith API";
      
      // Priority 2: Y2Mate
      if (!downloadUrl) {
        console.log("⚠️ Keith failed, trying Y2Mate...");
        downloadUrl = await apis.y2mate.downloadAudio(videoUrl);
        if (downloadUrl) apiUsed = "Y2Mate API";
      }
      
      // Priority 3: Tomp3 (alternative)
      if (!downloadUrl) {
        console.log("⚠️ Y2Mate failed, trying alternative...");
        downloadUrl = await apis.tomp3.downloadAudio(videoUrl);
        if (downloadUrl) apiUsed = "Tomp3 API";
      }
      
      // Priority 4: Direct from YouTube (last resort)
      if (!downloadUrl && videoId) {
        console.log("⚠️ All APIs failed, trying direct method...");
        try {
          const directUrl = `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(videoUrl)}&type=mp3`;
          const response = await axios.get(directUrl, { timeout: 15000 });
          if (response.data?.result?.audio?.url) {
            downloadUrl = response.data.result.audio.url;
            apiUsed = "Direct API";
          }
        } catch (error) {
          console.error("Direct method failed:", error.message);
        }
      }

      if (!downloadUrl) {
        console.error("❌ All download methods failed");
        await sock.sendMessage(jid, { 
          text: `❌ All download services failed. Please try:\n1. Another song\n2. Direct YouTube URL\n3. Try again later`,
          edit: statusMsg.key 
        });
        return;
      }

      console.log(`✅ [SONG] Using ${apiUsed} for download`);
      
      await sock.sendMessage(jid, { 
        text: `🔍 *Found:* "${videoTitle}" ✅\n⬇️ *Downloading...* ✅\n🎵 *Processing audio...*`,
        edit: statusMsg.key 
      });

      // Create temp directory
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      
      // Clean filename
      const fileName = `${videoTitle.replace(/[^\w\s.-]/gi, '').substring(0, 50)}.mp3`;
      const tempFile = path.join(tempDir, `song_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`);

      // Download and process file
      try {
        // Download file
        const response = await axios({
          url: downloadUrl,
          method: 'GET',
          responseType: 'stream',
          timeout: 45000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.status !== 200) {
          throw new Error(`Download failed with status ${response.status}`);
        }

        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Check file size
        const stats = fs.statSync(tempFile);
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        
        if (stats.size === 0) {
          throw new Error("Downloaded file is empty");
        }
        
        if (fileSizeMB > 50) {
          console.log(`⚠️ File too large: ${fileSizeMB}MB`);
          await sock.sendMessage(jid, { 
            text: `❌ File too large (${fileSizeMB}MB). Maximum size is 50MB.`,
            edit: statusMsg.key 
          });
          fs.unlinkSync(tempFile);
          return;
        }

        const audioBuffer = fs.readFileSync(tempFile);

        // Get thumbnail
        let thumbnailBuffer = null;
        try {
          const thumbResponse = await axios.get(thumbnail, {
            responseType: 'arraybuffer',
            timeout: 10000
          });
          thumbnailBuffer = Buffer.from(thumbResponse.data);
        } catch (thumbError) {
          console.log("⚠️ Could not fetch thumbnail");
        }

        // Send as audio message
        await sock.sendMessage(jid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: videoTitle.substring(0, 60),
              body: `🎵 Song • ${fileSizeMB}MB`,
              mediaType: 2,
              thumbnail: thumbnailBuffer,
              mediaUrl: videoUrl
            }
          }
        }, { quoted: m });

        // Clean up
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
          console.log(`🧹 Cleaned temp file: ${tempFile}`);
        }

        await sock.sendMessage(jid, { 
          text: `✅ *Song Sent!*\n\n"${videoTitle}"\n📦 Size: ${fileSizeMB}MB\n🎵 Audio Message Sent\n🔧 API: ${apiUsed}`,
          edit: statusMsg.key 
        });

        console.log(`✅ [SONG] Success: "${videoTitle}" (${fileSizeMB}MB) via ${apiUsed}`);

      } catch (downloadError) {
        console.error("❌ [SONG] Download error:", downloadError.message);
        await sock.sendMessage(jid, { 
          text: `❌ Failed to process audio: ${downloadError.message}`,
          edit: statusMsg.key 
        });
        if (fs.existsSync(tempFile)) {
          try { fs.unlinkSync(tempFile); } catch {}
        }
      }

    } catch (error) {
      console.error("❌ [SONG] ERROR:", error);
      await sock.sendMessage(jid, { 
        text: `❌ Error: ${error.message}` 
      }, { quoted: m });
    }
  }
};
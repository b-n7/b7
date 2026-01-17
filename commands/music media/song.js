import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: "song",
  aliases: ["music", "audio", "ytmp3", "play"],
  category: "download",
  description: "Download YouTube audio/song",
  
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    
    // Check if query is provided
    if (args.length === 0) {
      return sock.sendMessage(jid, {
        text: `🎵 *SONG DOWNLOADER*\n\n` +
              `📌 *Usage:* \`${PREFIX}song song name\`\n` +
              `📝 *Examples:*\n` +
              `• \`${PREFIX}song Home by NF\`\n` +
              `• \`${PREFIX}song https://youtube.com/...\`\n` +
              `• \`${PREFIX}song Ed Sheeran Shape of You\`\n\n` +
              `✨ Downloads audio from YouTube`
      }, { quoted: m });
    }

    const query = args.join(' ');
    
    try {
      // Show searching status
      await sock.sendMessage(jid, {
        text: `🔍 *Searching for:* "${query}"...`,
        quoted: m
      });

      // Step 1: Search for the song on YouTube
      let videoUrl = '';
      let videoTitle = '';
      let thumbnailUrl = '';
      let duration = '';

      // Check if it's a YouTube URL
      if (query.match(/(youtube\.com|youtu\.be)/i)) {
        videoUrl = query;
        // Extract video ID for thumbnail
        const videoId = query.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
        if (videoId) {
          thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }
        videoTitle = "YouTube Audio";
      } else {
        // Search using Keith API
        const searchUrl = `https://apiskeith.vercel.app/search/yts?query=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchUrl, { timeout: 10000 });
        
        if (!searchResponse.data?.result || searchResponse.data.result.length === 0) {
          return sock.sendMessage(jid, {
            text: `❌ *No Results*\n\nNo songs found for: "${query}"\n\n` +
                  `💡 *Try:*\n` +
                  `• Different search terms\n` +
                  `• Artist + song name\n` +
                  `• Direct YouTube URL`
          }, { quoted: m });
        }

        const video = searchResponse.data.result[0];
        videoUrl = video.url || `https://youtube.com/watch?v=${video.videoId}`;
        videoTitle = video.title || "Unknown Song";
        thumbnailUrl = video.thumbnail || '';
        duration = video.duration || '';
      }

      // Step 2: Download audio using Keith API
      await sock.sendMessage(jid, {
        text: `✅ *Found:* "${videoTitle}"\n⬇️ *Downloading audio...*`,
        quoted: m
      });

      const downloadUrl = `https://apiskeith.vercel.app/download/audio?url=${encodeURIComponent(videoUrl)}`;
      
      // Download the audio file
      const audioResponse = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'arraybuffer',
        timeout: 60000,
        headers: {
          'User-Agent': 'WolfBot/1.0',
          'Accept': 'audio/mpeg,audio/*'
        }
      });

      if (!audioResponse.data || audioResponse.data.length === 0) {
        throw new Error('Empty audio response');
      }

      // Create temp directory
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Save audio file
      const audioFilename = `song_${Date.now()}.mp3`;
      const audioPath = path.join(tempDir, audioFilename);
      fs.writeFileSync(audioPath, audioResponse.data);

      const fileSize = Math.round(audioResponse.data.length / 1024 / 1024 * 100) / 100;
      
      // Get thumbnail
      let thumbnailBuffer = null;
      if (thumbnailUrl) {
        try {
          const thumbResponse = await axios.get(thumbnailUrl, {
            responseType: 'arraybuffer',
            timeout: 10000
          });
          thumbnailBuffer = Buffer.from(thumbResponse.data);
        } catch (thumbError) {
          console.log('⚠️ Could not fetch thumbnail');
        }
      }

      // Send audio with thumbnail
      await sock.sendMessage(jid, {
        audio: fs.readFileSync(audioPath),
        mimetype: 'audio/mpeg',
        fileName: `${videoTitle.substring(0, 50).replace(/[^\w\s.-]/gi, '')}.mp3`,
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: videoTitle.substring(0, 60),
            body: duration ? `⏱️ ${duration} • 🎵 Song` : '🎵 Song Download',
            mediaType: 1,
            thumbnail: thumbnailBuffer,
            sourceUrl: videoUrl,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      // Clean up
      fs.unlinkSync(audioPath);

      // Send success message
      await sock.sendMessage(jid, {
        text: `✅ *Download Complete!*\n\n` +
              `🎵 *Title:* ${videoTitle}\n` +
              `📊 *Size:* ${fileSize} MB\n` +
              `🎯 *Quality:* MP3 Audio\n` +
              `✨ *Enjoy your song!*`,
        quoted: m
      });

      // Send success reaction
      await sock.sendMessage(jid, {
        react: { text: '✅', key: m.key }
      });

    } catch (error) {
      console.error('[SONG] Error:', error.message);
      
      let errorMessage = `❌ *Download Failed*\n\n`;
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        errorMessage += `• API is unavailable\n`;
        errorMessage += `• Try again later\n\n`;
      } else if (error.response) {
        if (error.response.status === 404) {
          errorMessage += `• Song not found\n`;
          errorMessage += `• Try different search\n\n`;
        } else {
          errorMessage += `• API Error: ${error.response.status}\n\n`;
        }
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage += `• Download timeout\n`;
        errorMessage += `• Try again\n\n`;
      } else if (error.message.includes('Empty audio')) {
        errorMessage += `• No audio data received\n`;
        errorMessage += `• Try different song\n\n`;
      } else {
        errorMessage += `• Error: ${error.message}\n\n`;
      }
      
      errorMessage += `💡 *Tips:*\n`;
      errorMessage += `• Use exact song name\n`;
      errorMessage += `• Include artist name\n`;
      errorMessage += `• Try direct YouTube URL\n\n`;
      
      errorMessage += `📌 *Usage:* \`${PREFIX}song song name\`\n`;
      errorMessage += `📝 *Example:* \`${PREFIX}song Adele Hello\``;
      
      await sock.sendMessage(jid, {
        text: errorMessage
      }, { quoted: m });
      
      // Send error reaction
      await sock.sendMessage(jid, {
        react: { text: '❌', key: m.key }
      });
    }
  }
};
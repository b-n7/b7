









import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCurrentMenuStyle } from "./menustyle.js";
import { setLastMenu, getAllFieldsStatus } from "../menus/menuToggles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: "menu",
  description: "Shows the Wolf Command Center in various styles",
  async execute(sock, m, args) {
    const jid = m.key.remoteJid;
    const style = getCurrentMenuStyle();
    
    // Set the last used menu for toggle commands
    setLastMenu(style);

    console.log(`\n🐺 [MENU] Command received from: ${jid} | Using style: ${style}`);

    try {
      switch (style) {
      case 1: {
  // Add these helper functions (same as other cases)
  const getBotMode = () => {
    try {
      // Check multiple possible locations with priority order
      const possiblePaths = [
        './bot_mode.json',  // Root directory (most likely)
        path.join(__dirname, 'bot_mode.json'),  // Same directory as menu
        path.join(__dirname, '../bot_mode.json'),  // Parent directory
        path.join(__dirname, '../../bot_mode.json'),  // 2 levels up
        path.join(__dirname, '../../../bot_mode.json'),  // 3 levels up
        path.join(__dirname, '../commands/owner/bot_mode.json'),  // Owner commands directory
      ];
      
      for (const modePath of possiblePaths) {
        if (fs.existsSync(modePath)) {
          try {
            const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
            
            if (modeData.mode) {
              // Format for display
              let displayMode;
              switch(modeData.mode.toLowerCase()) {
                case 'public':
                  displayMode = '🌍 Public';
                  break;
                case 'silent':
                  displayMode = '🔇 Silent';
                  break;
                default:
                  displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
              }
              
              return displayMode;
            }
          } catch (parseError) {
            // Continue to next path
          }
        }
      }
      
      // Fallback to global variables
      if (global.BOT_MODE) {
        return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (global.mode) {
        return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (process.env.BOT_MODE) {
        return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      
    } catch (error) {
      // Error handling
    }
    
    return '🌍 Public'; // Default fallback
  };
  
  const getBotName = () => {
    try {
      // Check multiple possible locations with priority order
      const possiblePaths = [
        './bot_settings.json',  // Root directory (most likely)
        path.join(__dirname, 'bot_settings.json'),  // Same directory as menu
        path.join(__dirname, '../bot_settings.json'),  // Parent directory
        path.join(__dirname, '../../bot_settings.json'),  // 2 levels up
        path.join(__dirname, '../../../bot_settings.json'),  // 3 levels up
        path.join(__dirname, '../commands/owner/bot_settings.json'),  // Owner commands directory
      ];
      
      for (const settingsPath of possiblePaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.botName && settings.botName.trim() !== '') {
              return settings.botName.trim();
            }
          } catch (parseError) {
            // Continue to next path
          }
        }
      }
      
      // Fallback to global variables
      if (global.BOT_NAME) {
        return global.BOT_NAME;
      }
      
      // Fallback to environment variable
      if (process.env.BOT_NAME) {
        return process.env.BOT_NAME;
      }
      
    } catch (error) {
      // Error handling
    }
    
    return 'WOLFBOT'; // Default fallback
  };

  // Load bot name using the helper function
  const botName = getBotName();
  const botMode = getBotMode();

  const imgPath1 = path.join(__dirname, "media", "wolfbot.jpg");
  const imgPath2 = path.join(__dirname, "../media", "wolfbot.jpg");
  const imagePath = fs.existsSync(imgPath1) ? imgPath1 : fs.existsSync(imgPath2) ? imgPath2 : null;

  if (!imagePath) {
    await sock.sendMessage(jid, { text: "⚠️ Image 'wolfbot.jpg' not found!" }, { quoted: m });
    return;
  }

  const buffer = fs.readFileSync(imagePath);
  const caption = `*🐺🌕 *${botName}* 🌕🐺*
┌────────────────
│ 🏠 GROUP MANAGEMENT 🏠 
├────────────────
│ 🛡️ ADMIN & MODERATION 🛡️ 
├────────────────
│ add                     
│ promote                 
│ demote                  
│ kick                    
│ ban                     
│ unban                   
│ banlist                 
│ clearbanlist            
│ warn                    
│ mute                    
│ unmute                  
│ gctime                  
│ antileave               
│ antilink                
│ welcome                 
├────────────────
│ 🚫 AUTO-MODERATION 🚫   
├────────────────
│ antisticker             
│ antiviewonce  
│ antilink  
│ antiimage
│ antivideo
│ antiaudio
│ antimention
│ antistatusmention  
│ antigrouplink
├────────────────
│ 📊 GROUP INFO & TOOLS 📊 
├────────────────
│ groupinfo               
│ tagadmin                
│ tagall                  
│ hidetag                 
│ link                    
│ invite                  
│ revoke                  
│ setdesc                 
│ fangtrace               
│ getgpp                  
└────────────────

┌────────────────
│ 👑 OWNER CONTROLS 👑    
├────────────────
│ ⚡ CORE MANAGEMENT ⚡    
├────────────────
│ setbotname              
│ iamowner                
│ about                   
│ setprefix               
│ block                   
│ unblock                 
│ blockdetect             
│ silent                  
│ anticall                
│ mode                    ← ${botMode}
│ online                  
│ setpp                   
│ repo                    
├────────────────
│ 🔄 SYSTEM & MAINTENANCE 🛠️ 
├────────────────
│ restart                 
│ workingreload           
│ reloadenv               
│ getsettings             
│ setsetting              
│ test                    
│ disk                    
│ hostip                  
│ findcommands            
└────────────────

┌────────────────
│ ⚙️ AUTOMATION ⚙️
├────────────────
│ autoread                
│ autotyping              
│ autorecording           
│ autoreact               
│ autoreactstatus         
│ autobio                 
│ autorec                 
└────────────────

┌────────────────
│ ✨ GENERAL UTILITIES ✨  
├────────────────
│ 🔍 INFO & SEARCH 🔎     
├────────────────
│ ping                    
│ time                    
│ uptime                  
│ alive                   
│ define                  
│ news                    
│ covid                   
│ quote                   
│ prefixinfo              
├───────────────
│ 🔗 CONVERSION & MEDIA 📁 
├───────────────
│ translate               
│ shorturl                
│ qrencode                
│ take                    
│ toimage                 
│ tostatus                
│ toaudio                 
│ tovoice                 
│ save                    
│ url                     
├───────────────
│ 📝 PERSONAL TOOLS 📅    
├───────────────
│ goodmorning             
│ goodnight               
└────────────────

├────────────────
│ 🎵 MUSIC & MEDIA 🎶
├────────────────
│ play                    
│ song                    
│ lyrics                  
│ spotify                 
│ video                   
│ video2                  
│ bassboost               
│ trebleboost             
└────────────────

┌───────────────
│ 🤖 MEDIA & AI COMMANDS 🧠 
├───────────────
│ ⬇️ MEDIA DOWNLOADS 📥     
├───────────────
│ youtube                 
│ tiktok                  
│ instagram               
│ facebook                
│ snapchat                
│ apk                     
├───────────────
│ 🎨 AI GENERATION 💡    
├───────────────
│ gpt                     
│ gemini                  
│ deepseek                
│ deepseek+               
│ analyze                 
│ suno                    
│ wolfbot                 
│ videogen                
└───────────────

┌───────────────
│ 🖼️ IMAGE TOOLS 🖼️
├───────────────
│ image                   
│ imagegenerate           
│ anime                   
│ art                     
│ real                    
└───────────────

┌───────────────
│ 🛡️ SECURITY & HACKING 🔒 
├───────────────
│ 🌐 NETWORK & INFO 📡   
├───────────────
│ ipinfo                  
│ shodan                  
│ iplookup                
│ getip                   
└───────────────

┌────────────────
│ 🎨 LOGO DESIGN STUDIO 🎨
├────────────────
│ 🌟 PREMIUM METALS 🌟    
├────────────────
│ goldlogo                
│ silverlogo              
│ platinumlogo            
│ chromelogo              
│ diamondlogo             
│ bronzelogo              
│ steelogo                
│ copperlogo              
│ titaniumlogo            
├────────────────
│ 🔥 ELEMENTAL EFFECTS 🔥  
├────────────────
│ firelogo                
│ icelogo                 
│ iceglowlogo             
│ lightninglogo           
│ aqualogo                
│ rainbowlogo             
│ sunlogo                 
│ moonlogo                
├────────────────
│ 🎭 MYTHICAL & MAGICAL 🧙  
├────────────────
│ dragonlogo              
│ phoenixlogo             
│ wizardlogo              
│ crystallogo             
│ darkmagiclogo           
├────────────────
│ 🌌 DARK & GOTHIC 🌑     
├────────────────
│ shadowlogo              
│ smokelogo               
│ bloodlogo               
├────────────────
│ 💫 GLOW & NEON EFFECTS 🌈  
├────────────────
│ neonlogo                
│ glowlogo                
├────────────────
│ 🤖 TECH & FUTURISTIC 🚀  
├────────────────
│ matrixlogo              
└────────────────
┌────────────────
│ 🐙 GITHUB COMMANDS 🐙
├────────────────
│ gitclone
│ gitinfo
│ repo
│ commits
│ stars
│ watchers
│ release
└────────────────

🐺🌕 POWERED BY WOLF TECH 🌕🐺
*`;

  await sock.sendMessage(jid, { image: buffer, caption, mimetype: "image/jpeg" }, { quoted: m });
  break;
}
case 2: {
  // Add these helper functions (same as other cases)
  const getBotMode = () => {
    try {
      // Check multiple possible locations with priority order
      const possiblePaths = [
        './bot_mode.json',  // Root directory (most likely)
        path.join(__dirname, 'bot_mode.json'),  // Same directory as menu
        path.join(__dirname, '../bot_mode.json'),  // Parent directory
        path.join(__dirname, '../../bot_mode.json'),  // 2 levels up
        path.join(__dirname, '../../../bot_mode.json'),  // 3 levels up
        path.join(__dirname, '../commands/owner/bot_mode.json'),  // Owner commands directory
      ];
      
      for (const modePath of possiblePaths) {
        if (fs.existsSync(modePath)) {
          try {
            const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
            
            if (modeData.mode) {
              // Format for display
              let displayMode;
              switch(modeData.mode.toLowerCase()) {
                case 'public':
                  displayMode = '🌍 Public';
                  break;
                case 'silent':
                  displayMode = '🔇 Silent';
                  break;
                default:
                  displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
              }
              
              return displayMode;
            }
          } catch (parseError) {
            // Continue to next path
          }
        }
      }
      
      // Fallback to global variables
      if (global.BOT_MODE) {
        return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (global.mode) {
        return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (process.env.BOT_MODE) {
        return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      
    } catch (error) {
      // Error handling
    }
    
    return '🌍 Public'; // Default fallback
  };
  
  const getBotName = () => {
    try {
      // Check multiple possible locations with priority order
      const possiblePaths = [
        './bot_settings.json',  // Root directory (most likely)
        path.join(__dirname, 'bot_settings.json'),  // Same directory as menu
        path.join(__dirname, '../bot_settings.json'),  // Parent directory
        path.join(__dirname, '../../bot_settings.json'),  // 2 levels up
        path.join(__dirname, '../../../bot_settings.json'),  // 3 levels up
        path.join(__dirname, '../commands/owner/bot_settings.json'),  // Owner commands directory
      ];
      
      for (const settingsPath of possiblePaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.botName && settings.botName.trim() !== '') {
              return settings.botName.trim();
            }
          } catch (parseError) {
            // Continue to next path
          }
        }
      }
      
      // Fallback to global variables
      if (global.BOT_NAME) {
        return global.BOT_NAME;
      }
      
      // Fallback to environment variable
      if (process.env.BOT_NAME) {
        return process.env.BOT_NAME;
      }
      
    } catch (error) {
      // Error handling
    }
    
    return 'WOLFBOT'; // Default fallback
  };

  // Load bot name and mode
  const botName = getBotName();
  const botMode = getBotMode();
  
  // 📝 Text Only
  const text = `🐺🌕 *${botName}* 🌕🐺 | Mode: ${botMode}
────────────────
> 🏠 *GROUP MANAGEMENT* — manage members & group
> • add — add user
> • promote — make admin
> • demote — remove admin
> • kick — remove user
> • ban — ban user
> • unban — unban user
> • banlist — show banned
> • clearbanlist — clear bans
> • warn — warn user
> • unwarn — remove warning
> • clearwarns — reset warnings
> • mute — mute user
> • unmute — unmute user
> • gctime — group time settings
> • lock — lock group
> • unlock — unlock group
> • welcome — set welcome message
> • goodbye — set goodbye message

> 🚫 *AUTO-MODERATION* — auto-protect group
> • antilink — block links
> • antisticker — block stickers
> • antiimage — block images
> • antivideo — block videos
> • antiaudio — block audio
> • antimention — block mentions
> • antistatusmention — block status mentions
> • antigrouplink — block group links

> 📊 *GROUP INFO & TOOLS* — group info commands
> • groupinfo — show info
> • tagadmin — mention admins
> • tagall — mention all
> • hidetag — hide mentions
> • link — show group link
> • invite — generate invite
> • revoke — revoke link
> • setname — change name
> • setdesc — change description
> • setgcpp — change group picture
> • fangtrace — trace user
> • disp — display group stats
> • kickall — kick all members
> • getgpp — get group picture

> 👑 *OWNER CONTROLS* — bot owner commands
> • setbotname — change bot name
> • setprefix — change prefix
> • block — block user
> • unblock — unblock user
> • silent — silent mode
> • mode — change bot mode (${botMode})
> • restart — restart bot
> • setpp — set bot profile
> • resetbotname — reset to default
> • quickname — set quick name

> 🔄 *SYSTEM & MAINTENANCE* — bot maintenance
> • restart — restart bot
> • update — update bot
> • backup — backup data
> • restore — restore data
> • cleardb — clear database
> • cleartemp — clear temp files
> • reloadenv — reload environment
> • test — test system
> • disk — check disk space
> • hostip — get host IP
> • findcommands — search commands

> ✨ *GENERAL UTILITIES* — info & conversions
> • ping — bot ping
> • time — current time
> • uptime — bot uptime
> • alive — check if bot is alive
> • define — word definition
> • news — latest news
> • weather — weather info
> • covid — covid stats
> • quote — random quotes
> • translate — translate text
> • shorturl — shorten URL
> • qrencode — QR encode
> • take — screenshot website
> • toimage — convert to image
> • tostatus — convert to status
> • toaudio — convert to audio
> • tovoice — convert to voice
> • save — save content
> • url — get URL info
> • goodmorning — morning message
> • goodnight — night message

> 🎵 *MUSIC & MEDIA* — entertainment
> • play — play music
> • song — download song
> • lyrics — get lyrics
> • spotify — spotify music
> • video — download video
> • video2 — alternative video
> • bassboost — bass boost audio
> • trebleboost — treble boost

> 🤖 *MEDIA & AI* — media & AI tools
> • youtube — YouTube downloader
> • tiktok — TikTok downloader
> • instagram — Instagram downloader
> • facebook — Facebook downloader
> • snapchat — Snapchat downloader
> • apk — APK downloader
> • gemini — Google AI
> • gpt — OpenAI ChatGPT
> • deepseek — DeepSeek AI
> • deepseek+ — DeepSeek advanced
> • wolfbot — Wolf AI assistant
> • analyze — analyze content
> • suno — Suno AI music
> • videogen — video generator

> 🖼️ *IMAGE TOOLS* — image generation
> • image — generate images
> • imagegenerate — AI image gen
> • anime — anime images
> • art — art images
> • real — realistic images

> 🛡️ *SECURITY & NETWORK* — network & scans
> • ipinfo — IP information
> • shodan — device scanning
> • iplookup — IP lookup
> • getip — get IP address
> • pwcheck — password strength
> • portscan — scan ports
> • subdomains — find subdomains

> 🎨 *LOGO DESIGN STUDIO* — design logos
> • goldlogo — gold style
> • silverlogo — silver style
> • platinumlogo — platinum style
> • chromelogo — chrome style
> • diamondlogo — diamond style
> • bronzelogo — bronze style
> • steelogo — steel style
> • copperlogo — copper style
> • titaniumlogo — titanium style
> • firelogo — fire effect
> • icelogo — ice effect
> • iceglowlogo — glowing ice
> • lightninglogo — lightning effect
> • aqualogo — water effect
> • rainbowlogo — rainbow colors
> • sunlogo — sun style
> • moonlogo — moon style
> • dragonlogo — dragon theme
> • phoenixlogo — phoenix theme
> • wizardlogo — wizard theme
> • crystallogo — crystal style
> • darkmagiclogo — dark magic
> • shadowlogo — shadow effect
> • smokelogo — smoke effect
> • bloodlogo — blood style
> • neonlogo — neon lights
> • glowlogo — glowing effect
> • matrixlogo — matrix style
> • 50+ more logo styles available

> ⚙️ *AUTOMATION* — auto features
> • autoread — auto read messages
> • autotyping — auto typing
> • autorecording — auto recording
> • autoreact — auto reactions
> • autoreactstatus — auto react to status
> • autobio — auto update bio
> • autorec — auto record

> 🐙 *GITHUB COMMANDS* — GitHub tools
> • gitclone — clone repository
> • gitinfo — repo information
> • repo — repository info
> • commits — view commits
> • stars — check stars
> • watchers — check watchers
> • release — view releases

────────────────
📌 *Prefix:* ${global.prefix || "."}
📌 *Mode:* ${botMode}
📌 *Total Commands:* 200+
📌 *Type "${global.prefix || "."}menu <style>" to change menu style*
📌 *Available styles: 1-7*

🐺🌕*POWERED BY WOLF TECH*🌕🐺
`; 
  await sock.sendMessage(jid, { text }, { quoted: m });
  break;
}








case 3: {
  try {
    const jid = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    // Add these helper functions (same as other cases)
    const getBotMode = () => {
      try {
        // Check multiple possible locations with priority order
        const possiblePaths = [
          './bot_mode.json',  // Root directory (most likely)
          path.join(__dirname, 'bot_mode.json'),  // Same directory as menu
          path.join(__dirname, '../bot_mode.json'),  // Parent directory
          path.join(__dirname, '../../bot_mode.json'),  // 2 levels up
          path.join(__dirname, '../../../bot_mode.json'),  // 3 levels up
          path.join(__dirname, '../commands/owner/bot_mode.json'),  // Owner commands directory
        ];
        
        for (const modePath of possiblePaths) {
          if (fs.existsSync(modePath)) {
            try {
              const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
              
              if (modeData.mode) {
                // Format for display
                let displayMode;
                switch(modeData.mode.toLowerCase()) {
                  case 'public':
                    displayMode = '🌍 Public';
                    break;
                  case 'silent':
                    displayMode = '🔇 Silent';
                    break;
                  default:
                    displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
                }
                
                return displayMode;
              }
            } catch (parseError) {
              // Continue to next path
            }
          }
        }
        
        // Fallback to global variables
        if (global.BOT_MODE) {
          return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
        }
        if (global.mode) {
          return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
        }
        if (process.env.BOT_MODE) {
          return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
        }
        
      } catch (error) {
        // Error handling
      }
      
      return '🌍 Public'; // Default fallback
    };
    
    const getBotName = () => {
      try {
        // Check multiple possible locations with priority order
        const possiblePaths = [
          './bot_settings.json',  // Root directory (most likely)
          path.join(__dirname, 'bot_settings.json'),  // Same directory as menu
          path.join(__dirname, '../bot_settings.json'),  // Parent directory
          path.join(__dirname, '../../bot_settings.json'),  // 2 levels up
          path.join(__dirname, '../../../bot_settings.json'),  // 3 levels up
          path.join(__dirname, '../commands/owner/bot_settings.json'),  // Owner commands directory
        ];
        
        for (const settingsPath of possiblePaths) {
          if (fs.existsSync(settingsPath)) {
            try {
              const settingsData = fs.readFileSync(settingsPath, 'utf8');
              const settings = JSON.parse(settingsData);
              
              if (settings.botName && settings.botName.trim() !== '') {
                return settings.botName.trim();
              }
            } catch (parseError) {
              // Continue to next path
            }
          }
        }
        
        // Fallback to global variables
        if (global.BOT_NAME) {
          return global.BOT_NAME;
        }
        
        // Fallback to environment variable
        if (process.env.BOT_NAME) {
          return process.env.BOT_NAME;
        }
        
      } catch (error) {
        // Error handling
      }
      
      return 'SILENT WOLF BOT'; // Default fallback for case 3
    };

    // Read owner information from owner.json
    let ownerJid = "";
    let ownerNumber = "";
    
    try {
      const ownerPath = path.join(__dirname, 'owner.json');
      if (fs.existsSync(ownerPath)) {
        const ownerData = await fs.readFile(ownerPath, "utf8");
        const ownerInfo = JSON.parse(ownerData);
        
        // Try different possible field names in owner.json
        if (ownerInfo.owner && ownerInfo.owner.trim() !== '') {
          ownerNumber = ownerInfo.owner.trim();
        } else if (ownerInfo.number && ownerInfo.number.trim() !== '') {
          ownerNumber = ownerInfo.number.trim();
        } else if (ownerInfo.phone && ownerInfo.phone.trim() !== '') {
          ownerNumber = ownerInfo.phone.trim();
        } else if (ownerInfo.contact && ownerInfo.contact.trim() !== '') {
          ownerNumber = ownerInfo.contact.trim();
        } else if (ownerInfo.OWNER_NUMBER && ownerInfo.OWNER_NUMBER.trim() !== '') {
          ownerNumber = ownerInfo.OWNER_NUMBER.trim();
        } else if (Array.isArray(ownerInfo) && ownerInfo.length > 0) {
          // If it's an array, take the first one
          ownerNumber = typeof ownerInfo[0] === 'string' ? ownerInfo[0] : "Unknown";
        }
        
        // Get JID
        if (ownerInfo.OWNER_JID && ownerInfo.OWNER_JID.trim() !== '') {
          ownerJid = ownerInfo.OWNER_JID.trim();
        } else if (ownerNumber) {
          ownerJid = `${ownerNumber}@s.whatsapp.net`;
        }
        
        console.log(`📋 Menu - Owner info loaded: ${ownerNumber} | ${ownerJid}`);
      }
    } catch (ownerError) {
      console.error("❌ Menu - Failed to read owner.json:", ownerError.message);
      // Fallback values
      ownerNumber = global.owner || process.env.OWNER_NUMBER || "254703397679";
      ownerJid = `${ownerNumber}@s.whatsapp.net`;
    }

    // Load bot name and mode
    const botName = getBotName();
    const botMode = getBotMode();
    
    console.log(`📋 Menu - Bot name: "${botName}" | Mode: ${botMode}`);

    // 🔧 Fetch GitHub user data
    const githubOwner = "777Wolf-dot";
    const githubUserUrl = `https://api.github.com/users/${githubOwner}`;
    
    let githubData = {
      avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      html_url: `https://github.com/${githubOwner}`,
      name: githubOwner,
      public_repos: "50+",
      followers: "100+"
    };
    
    try {
      const { data } = await axios.get(
        githubUserUrl,
        { 
          headers: { 
            "User-Agent": "Wolf-Bot-Menu",
            "Accept": "application/vnd.github.v3+json"
          },
          timeout: 5000
        }
      );
      githubData = {
        ...githubData,
        ...data,
        name: data.name || githubOwner
      };
    } catch (githubError) {
      console.log("⚠️ Using fallback GitHub data:", githubError.message);
    }

    // Get bot stats
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const usedMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMemory = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);
    const memoryPercent = ((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100).toFixed(1);

    const menuText = `
╭─── 🐺 *${botName}* 🐺 ───
│
│ 📊 *Bot Status:*
│ ⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
│ 💾 Memory: ${usedMemory}MB / ${totalMemory}MB (${memoryPercent}%)
│ ⚙️ Mode: ${botMode}
│ 👑 Owner: @${ownerNumber || "Unknown"}
│ 🔗 GitHub: ${githubData.name || githubOwner}
│
│────── BOT MENU ──────

│ ┌── GROUP MANAGEMENT ──
│ │ add
│ │ promote
│ │ demote
│ │ kick
│ │ ban
│ │ unban
│ │ banlist
│ │ clearbanlist
│ │ warn
│ │ mute
│ │ unmute
│ │ gctime
│ │ antisticker
│ │ groupinfo
│ │ tagadmin
│ │ tagall
│ │ hidetag
│ │ link
│ │ invite
│ │ revoke
│ │ setdesc
│ │ fangtrace
│ │ disp
│ │ kickall
│ │ getgpp
│ │ vcf
│ └─────────────────

│ ┌── OWNER CONTROLS ──
│ │ setprefix
│ │ block
│ │ unblock
│ │ silent
│ │ setbotname
│ │ setpp
│ │ restart
│ │ autotype
│ │ mode
│ │ resetbotname
│ └─────────────────

│ ┌── GENERAL UTILITIES ─
│ │ ping
│ │ time
│ │ uptime
│ │ about
│ │ repo
│ │ alive
│ │ define
│ │ wiki
│ │ news
│ │ weather
│ │ covid
│ │ quote
│ │ translate
│ │ shorturl
│ │ qrencode
│ │ qrdecode
│ │ reverseimage
│ │ toaudio
│ │ tovoice
│ │ save
│ │ goodmorning
│ │ goodnight
│ └─────────────────

│ ┌── MUSIC & FUN ──
│ │ play
│ │ song
│ │ lyrics
│ │ spotify
│ │ video
│ │ video2
│ │ bassboost
│ │ trebleboost
│ └─────────────────

│ ┌── MEDIA & AI ──
│ │ tiktokdl
│ │ instagram
│ │ youtube
│ │ facebook
│ │ snapchat
│ │ gemini
│ │ gpt
│ │ deepseek
│ │ wolfbot
│ │ videogen
│ │ suno
│ │ analyze
│ └─────────────────

│ ┌── IMAGE TOOLS ──
│ │ image
│ │ imagegenerate
│ │ anime
│ │ art
│ │ real
│ └─────────────────

│ ┌── SECURITY & HACKING ──
│ │ ipinfo
│ │ shodan
│ │ iplookup
│ │ getip
│ │ pwcheck
│ │ portscan
│ │ subdomains
│ └─────────────────

│ ┌── LOGO DESIGN ──
│ │ goldlogo
│ │ silverlogo
│ │ platinumlogo
│ │ chromelogo
│ │ diamondlogo
│ │ bronzelogo
│ │ steelogo
│ │ copperlogo
│ │ titaniumlogo
│ │ firelogo
│ │ icelogo
│ │ iceglowlogo
│ │ lightninglogo
│ │ aqualogo
│ │ rainbowlogo
│ │ sunlogo
│ │ moonlogo
│ │ volcanologo
│ │ thunderlogo
│ │ windlogo
│ │ earthlogo
│ │ waterlogo
│ │ forestlogo
│ │ dragonlogo
│ │ phoenixlogo
│ │ wizardlogo
│ │ crystallogo
│ │ magiclogo
│ │ darkmagiclogo
│ │ shadowlogo
│ │ smokelogo
│ │ bloodlogo
│ │ shadowflamelogo
│ │ venomlogo
│ │ skullogo
│ │ nightlogo
│ │ hellfirelogo
│ │ neonlogo
│ │ glowlogo
│ │ lightlogo
│ │ neonflamelogo
│ │ cyberlogo
│ │ matrixlogo
│ │ techlogo
│ │ hologramlogo
│ │ vaporlogo
│ │ pixelogo
│ │ futuristiclogo
│ │ digitalogo
│ │ cartoonlogo
│ │ comiclogo
│ │ graffitilogo
│ │ retrologo
│ │ popartlogo
│ └─────────────────

│── 🐺 POWERED BY WOLFTECH 🐺 ──

📌 *Usage:* Prefix + command (e.g., .ping)
📌 *Prefix:* ${global.prefix || "."}
📌 *Mode:* ${botMode}
📌 *Total Commands:* 150+
📌 *Need help?* Contact: @${ownerNumber}
    `.trim();

    await sock.sendMessage(
      jid,
      {
        text: menuText,
        contextInfo: {
          mentionedJid: ownerJid ? [ownerJid] : [],
          externalAdReply: {
            title: `🐺 ${botName}`,
            body: `Mode: ${botMode} | Uptime: ${hours}h | Owner: ${ownerNumber}`,
            mediaType: 1,
            thumbnailUrl: githubData.avatar_url,
            sourceUrl: githubData.html_url,
            renderLargerThumbnail: true,
            showAdAttribution: false
          }
        }
      },
      { quoted: m }
    );

    console.log(`✅ Menu sent with GitHub integration | Bot: "${botName}" | Owner: ${ownerNumber}`);

  } catch (err) {
    console.error("❌ Menu error:", err.message || err);
    
    // Fallback simple menu
    const fallbackText = `
╭── 🐺 SILENT WOLF BOT ──
│
│ 📁 Group Management: add, promote, demote, kick, ban, unban
│ 👑 Owner Controls: setprefix, block, unblock, restart
│ 🛠️ Utilities: ping, time, about, repo, alive, weather
│ 🎵 Music: play, song, bassboost
│ 🎭 Media & AI: tiktokdl, gemini, gpt, deepseek
│ 🔐 Security: ipinfo, shodan, iplookup
│ 🎨 Logo Design: 50+ logo styles available
│
╰── Prefix: ${global.prefix || "."} | Mode: ${global.mode || "public"}

💡 *Full menu temporarily unavailable*
👑 Maintained by: ${global.owner || "Owner"}
    `.trim();
    
    await sock.sendMessage(
      m.key.remoteJid,
      { 
        text: fallbackText,
        contextInfo: {
          externalAdReply: {
            title: "Wolf Bot Menu",
            body: "Basic menu - Full features available",
            mediaType: 1,
            thumbnailUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
            sourceUrl: "https://github.com/777Wolf-dot",
            renderLargerThumbnail: true,
            showAdAttribution: false
          }
        }
      },
      { quoted: m }
    );
  }
  break;
}














      case 4: {
  // 🖼️ Full info + image + commands
  
  // Add these helper functions (same as other cases)
  const getBotMode = () => {
    try {
      // Check multiple possible locations with priority order
      const possiblePaths = [
        './bot_mode.json',  // Root directory (most likely)
        path.join(__dirname, 'bot_mode.json'),  // Same directory as menu
        path.join(__dirname, '../bot_mode.json'),  // Parent directory
        path.join(__dirname, '../../bot_mode.json'),  // 2 levels up
        path.join(__dirname, '../../../bot_mode.json'),  // 3 levels up
        path.join(__dirname, '../commands/owner/bot_mode.json'),  // Owner commands directory
      ];
      
      for (const modePath of possiblePaths) {
        if (fs.existsSync(modePath)) {
          try {
            const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
            
            if (modeData.mode) {
              // Format for display
              let displayMode;
              switch(modeData.mode.toLowerCase()) {
                case 'public':
                  displayMode = '🌍 Public';
                  break;
                case 'silent':
                  displayMode = '🔇 Silent';
                  break;
                default:
                  displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
              }
              
              return displayMode;
            }
          } catch (parseError) {
            // Continue to next path
          }
        }
      }
      
      // Fallback to global variables
      if (global.BOT_MODE) {
        return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (global.mode) {
        return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (process.env.BOT_MODE) {
        return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      
    } catch (error) {
      // Error handling
    }
    
    return '🌍 Public'; // Default fallback
  };
  
  const getBotName = () => {
    try {
      // Check multiple possible locations with priority order
      const possiblePaths = [
        './bot_settings.json',  // Root directory (most likely)
        path.join(__dirname, 'bot_settings.json'),  // Same directory as menu
        path.join(__dirname, '../bot_settings.json'),  // Parent directory
        path.join(__dirname, '../../bot_settings.json'),  // 2 levels up
        path.join(__dirname, '../../../bot_settings.json'),  // 3 levels up
        path.join(__dirname, '../commands/owner/bot_settings.json'),  // Owner commands directory
      ];
      
      for (const settingsPath of possiblePaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.botName && settings.botName.trim() !== '') {
              return settings.botName.trim();
            }
          } catch (parseError) {
            // Continue to next path
          }
        }
      }
      
      // Fallback to global variables
      if (global.BOT_NAME) {
        return global.BOT_NAME;
      }
      
      // Fallback to environment variable
      if (process.env.BOT_NAME) {
        return process.env.BOT_NAME;
      }
      
    } catch (error) {
      // Error handling
    }
    
    return 'WOLFBOT'; // Default fallback
  };
  
  // Load bot name using the helper function
  const botName = getBotName();
  
  const start = performance.now();
  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const mnt = Math.floor((uptime % 3600) / 60);
  const s = Math.floor(uptime % 60);
  const uptimeStr = `${h}h ${mnt}m ${s}s`;
  const speed = (performance.now() - start).toFixed(2);
  const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(0);
  const memPercent = Math.min(((usedMem / (totalMem * 1024)) * 100).toFixed(0), 100);
  const memBar = "█".repeat(Math.floor(memPercent / 10)) + "░".repeat(10 - Math.floor(memPercent / 10));

  // Load owner from owner.json file (improved version)
  let ownerNumber = "Unknown";
  try {
    const ownerPath = path.join(__dirname, 'owner.json');
    if (fs.existsSync(ownerPath)) {
      const ownerData = fs.readFileSync(ownerPath, 'utf8');
      const ownerInfo = JSON.parse(ownerData);
      
      // Try different possible field names in owner.json
      if (ownerInfo.owner && ownerInfo.owner.trim() !== '') {
        ownerNumber = ownerInfo.owner.trim();
      } else if (ownerInfo.number && ownerInfo.number.trim() !== '') {
        ownerNumber = ownerInfo.number.trim();
      } else if (ownerInfo.phone && ownerInfo.phone.trim() !== '') {
        ownerNumber = ownerInfo.phone.trim();
      } else if (ownerInfo.contact && ownerInfo.contact.trim() !== '') {
        ownerNumber = ownerInfo.contact.trim();
      } else if (Array.isArray(ownerInfo) && ownerInfo.length > 0) {
        // If it's an array, take the first one
        ownerNumber = typeof ownerInfo[0] === 'string' ? ownerInfo[0] : "Unknown";
      }
    }
  } catch (ownerError) {
    // Fallback to environment variable or global
    ownerNumber = global.owner || process.env.OWNER_NUMBER || "Unknown";
  }

  // Load bot mode using the helper function
  const botMode = getBotMode();

  const host = process.env.REPL_ID ? "Replit" : process.env.HEROKU_APP_NAME ? "Heroku" : process.env.RENDER ? "Render" : "Panel";
  const prefix = global.prefix || ".";
  const version = global.version || "v2.6.2";

  const imgPath1 = path.join(__dirname, "media", "wolfbot.jpg");
  const imgPath2 = path.join(__dirname, "../media/wolfbot.jpg");
  const imagePath = fs.existsSync(imgPath1) ? imgPath1 : fs.existsSync(imgPath2) ? imgPath2 : null;
  if (!imagePath) {
    await sock.sendMessage(jid, { text: "⚠️ Image 'wolfbot.jpg' not found!" }, { quoted: m });
    return;
  }
  const buffer = fs.readFileSync(imagePath);

  const infoCaption = `
│────── ${botName} ──────│
┃ User: ${m.pushName || "Anonymous"}
┃ Owner: ${ownerNumber}
┃ Mode: ${botMode}
┃ Host: ${host}
┃ Speed: ${speed} ms
┃ Prefix: [ ${prefix} ]
┃ Uptime: ${uptimeStr}
┃ Version: ${version}
┃ Usage: ${usedMem} MB of ${totalMem} GB
┃ RAM: ${memBar} ${memPercent}%
└────────────────
`;

  const commandsText = `│ ┌── GROUP MANAGEMENT ──
│ │ add
│ │ promote
│ │ demote
│ │ kick
│ │ ban
│ │ unban
│ │ banlist
│ │ clearbanlist
│ │ warn
│ │ mute
│ │ unmute
│ │ gctime
│ │ antisticker
│ │ groupinfo
│ │ tagadmin
│ │ tagall
│ │ hidetag
│ │ link
│ │ invite
│ │ revoke
│ │ setdesc
│ │ fangtrace
│ │ disp
│ │ kickall
│ │ getgpp
│ │ vcf
│ └─────────────────

│ ┌── OWNER CONTROLS ──
│ │ setprefix
│ │ block
│ │ unblock
│ │ silent
│ │ setbotname
│ │ setpp
│ │ restart
│ │ autotype
│ │ mode
│ └─────────────────

│ ┌── GENERAL UTILITIES ─
│ │ ping
│ │ time
│ │ uptime
│ │ about
│ │ repo
│ │ alive
│ │ define
│ │ wiki
│ │ news
│ │ weather
│ │ covid
│ │ quote
│ │ translate
│ │ shorturl
│ │ qrencode
│ │ qrdecode
│ │ reverseimage
│ │ toaudio
│ │ tovoice
│ │ save
│ │ goodmorning
│ │ goodnight
│ └─────────────────

│ ┌── MUSIC & FUN ──
│ │ play
│ │ song
│ │ lyrics
│ │ spotify
│ │ video
│ │ video2
│ │ bassboost
│ │ trebleboost
│ └─────────────────

│ ┌── MEDIA & AI ──
│ │ tiktokdl
│ │ instagram
│ │ youtube
│ │ facebook
│ │ snapchat
│ │ gemini
│ │ gpt
│ │ deepseek
│ │ wolfbot
│ │ videogen
│ │ suno
│ │ analyze
│ └─────────────────

│ ┌── IMAGE TOOLS ──
│ │ image
│ │ imagegenerate
│ │ anime
│ │ art
│ │ real
│ └─────────────────

│ ┌── SECURITY & HACKING ──
│ │ ipinfo
│ │ shodan
│ │ iplookup
│ │ getip
│ │ pwcheck
│ │ portscan
│ │ subdomains
│ └─────────────────

│ ┌── LOGO DESIGN ──
│ │ goldlogo
│ │ silverlogo
│ │ platinumlogo
│ │ chromelogo
│ │ diamondlogo
│ │ bronzelogo
│ │ steelogo
│ │ copperlogo
│ │ titaniumlogo
│ │ firelogo
│ │ icelogo
│ │ iceglowlogo
│ │ lightninglogo
│ │ aqualogo
│ │ rainbowlogo
│ │ sunlogo
│ │ moonlogo
│ │ volcanologo
│ │ thunderlogo
│ │ windlogo
│ │ earthlogo
│ │ waterlogo
│ │ forestlogo
│ │ dragonlogo
│ │ phoenixlogo
│ │ wizardlogo
│ │ crystallogo
│ │ magiclogo
│ │ darkmagiclogo
│ │ shadowlogo
│ │ smokelogo
│ │ bloodlogo
│ │ shadowflamelogo
│ │ venomlogo
│ │ skullogo
│ │ nightlogo
│ │ hellfirelogo
│ │ neonlogo
│ │ glowlogo
│ │ lightlogo
│ │ neonflamelogo
│ │ cyberlogo
│ │ matrixlogo
│ │ techlogo
│ │ hologramlogo
│ │ vaporlogo
│ │ pixelogo
│ │ futuristiclogo
│ │ digitalogo
│ │ cartoonlogo
│ │ comiclogo
│ │ graffitilogo
│ │ retrologo
│ │ popartlogo
│ └─────────────────

│── 🐺 POWERED BY WOLFTECH 🐺 ──
`;

  await sock.sendMessage(jid, { image: buffer, caption: infoCaption + commandsText, mimetype: "image/jpeg" }, { quoted: m });
  break;
}






case 5: {
  // 📝 Full info + commands (with individual toggles)
  let finalText = "";
  
  // ========== ADD "READ MORE" HELPER FUNCTION ==========
  const createReadMoreEffect = (text1, text2) => {
    /**
     * Creates WhatsApp's "Read more" effect using invisible characters
     * @param {string} text1 - First part (visible before "Read more")
     * @param {string} text2 - Second part (hidden after "Read more")
     * @returns {string} Formatted text with "Read more" effect
     */
    
    // WhatsApp needs MORE invisible characters to trigger "Read more"
    // Use 500+ characters for better reliability
    const invisibleChars = [
      '\u200E',    // LEFT-TO-RIGHT MARK
      '\u200F',    // RIGHT-TO-LEFT MARK
      '\u200B',    // ZERO WIDTH SPACE
      '\u200C',    // ZERO WIDTH NON-JOINER
      '\u200D',    // ZERO WIDTH JOINER
      '\u2060',    // WORD JOINER
      '\uFEFF',    // ZERO WIDTH NO-BREAK SPACE
    ];
    
    // Create a LONG string of invisible characters (500-600 chars)
    // WhatsApp needs enough to break the line detection
    const invisibleString = Array.from({ length: 550 }, 
      (_, i) => invisibleChars[i % invisibleChars.length]
    ).join('');
    
    // Add a newline after invisible characters for cleaner break
    return `${text1}${invisibleString}\n${text2}`;
  };
  // ========== END OF HELPER FUNCTION ==========
  
  // Add these helper functions at the start of case 5 (same as case 7)
  const getBotMode = () => {
    try {
      const possiblePaths = [
        './bot_mode.json',
        path.join(__dirname, 'bot_mode.json'),
        path.join(__dirname, '../bot_mode.json'),
        path.join(__dirname, '../../bot_mode.json'),
        path.join(__dirname, '../../../bot_mode.json'),
        path.join(__dirname, '../commands/owner/bot_mode.json'),
      ];
      
      for (const modePath of possiblePaths) {
        if (fs.existsSync(modePath)) {
          try {
            const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
            
            if (modeData.mode) {
              let displayMode;
              switch(modeData.mode.toLowerCase()) {
                case 'public':
                  displayMode = '🌍 Public';
                  break;
                case 'silent':
                  displayMode = '🔇 Silent';
                  break;
                case 'private':
                  displayMode = '🔒 Private';
                  break;
                case 'group-only':
                  displayMode = '👥 Group Only';
                  break;
                case 'maintenance':
                  displayMode = '🛠️ Maintenance';
                  break;
                default:
                  displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
              }
              return displayMode;
            }
          } catch (parseError) {}
        }
      }
      
      // Fallback to global variables
      if (global.BOT_MODE) {
        return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (global.mode) {
        return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (process.env.BOT_MODE) {
        return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      
    } catch (error) {}
    
    return '🌍 Public';
  };
  
  const getBotName = () => {
    try {
      const possiblePaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
        path.join(__dirname, '../../../bot_settings.json'),
        path.join(__dirname, '../commands/owner/bot_settings.json'),
      ];
      
      for (const settingsPath of possiblePaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.botName && settings.botName.trim() !== '') {
              return settings.botName.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.BOT_NAME) {
        return global.BOT_NAME;
      }
      
      if (process.env.BOT_NAME) {
        return process.env.BOT_NAME;
      }
      
    } catch (error) {}
    
    return 'WOLFBOT';
  };
  
  const getOwnerName = () => {
    try {
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.ownerName && settings.ownerName.trim() !== '') {
              return settings.ownerName.trim();
            }
          } catch (parseError) {}
        }
      }
      
      const ownerPath = path.join(__dirname, 'owner.json');
      if (fs.existsSync(ownerPath)) {
        const ownerData = fs.readFileSync(ownerPath, 'utf8');
        const ownerInfo = JSON.parse(ownerData);
        
        if (ownerInfo.owner && ownerInfo.owner.trim() !== '') {
          return ownerInfo.owner.trim();
        } else if (ownerInfo.number && ownerInfo.number.trim() !== '') {
          return ownerInfo.number.trim();
        } else if (ownerInfo.phone && ownerInfo.phone.trim() !== '') {
          return ownerInfo.phone.trim();
        } else if (ownerInfo.contact && ownerInfo.contact.trim() !== '') {
          return ownerInfo.contact.trim();
        } else if (Array.isArray(ownerInfo) && ownerInfo.length > 0) {
          const owner = typeof ownerInfo[0] === 'string' ? ownerInfo[0] : "Unknown";
          return owner;
        }
      }
      
      if (global.OWNER_NAME) {
        return global.OWNER_NAME;
      }
      if (global.owner) {
        return global.owner;
      }
      if (process.env.OWNER_NUMBER) {
        return process.env.OWNER_NUMBER;
      }
      
    } catch (error) {}
    
    return 'Unknown';
  };
  
  const getBotPrefix = () => {
    try {
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.prefix && settings.prefix.trim() !== '') {
              return settings.prefix.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.prefix) {
        return global.prefix;
      }
      
      if (process.env.PREFIX) {
        return process.env.PREFIX;
      }
      
    } catch (error) {}
    
    return '.';
  };
  
  const getBotVersion = () => {
    try {
      const ownerPath = path.join(__dirname, 'owner.json');
      if (fs.existsSync(ownerPath)) {
        const ownerData = fs.readFileSync(ownerPath, 'utf8');
        const ownerInfo = JSON.parse(ownerData);
        
        if (ownerInfo.version && ownerInfo.version.trim() !== '') {
          return ownerInfo.version.trim();
        }
      }
      
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.version && settings.version.trim() !== '') {
              return settings.version.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.VERSION) {
        return global.VERSION;
      }
      
      if (global.version) {
        return global.version;
      }
      
      if (process.env.VERSION) {
        return process.env.VERSION;
      }
      
    } catch (error) {}
    
    return 'v1.0.0';
  };
  
  const getDeploymentPlatform = () => {
    // Detect deployment platform
    if (process.env.REPL_ID || process.env.REPLIT_DB_URL) {
      return {
        name: 'Replit',
        status: 'Active',
        icon: '🌀'
      };
    } else if (process.env.HEROKU_APP_NAME) {
      return {
        name: 'Heroku',
        status: 'Active',
        icon: '🦸'
      };
    } else if (process.env.RENDER_SERVICE_ID) {
      return {
        name: 'Render',
        status: 'Active',
        icon: '⚡'
      };
    } else if (process.env.RAILWAY_ENVIRONMENT) {
      return {
        name: 'Railway',
        status: 'Active',
        icon: '🚂'
      };
    } else if (process.env.VERCEL) {
      return {
        name: 'Vercel',
        status: 'Active',
        icon: '▲'
      };
    } else if (process.env.GLITCH_PROJECT_REMIX) {
      return {
        name: 'Glitch',
        status: 'Active',
        icon: '🎏'
      };
    } else if (process.env.KOYEB) {
      return {
        name: 'Koyeb',
        status: 'Active',
        icon: '☁️'
      };
    } else if (process.env.CYCLIC_URL) {
      return {
        name: 'Cyclic',
        status: 'Active',
        icon: '🔄'
      };
    } else if (process.env.PANEL) {
      return {
        name: 'PteroPanel',
        status: 'Active',
        icon: '🖥️'
      };
    } else if (process.env.SSH_CONNECTION || process.env.SSH_CLIENT) {
      return {
        name: 'VPS/SSH',
        status: 'Active',
        icon: '🖥️'
      };
    } else if (process.platform === 'win32') {
      return {
        name: 'Windows PC',
        status: 'Active',
        icon: '💻'
      };
    } else if (process.platform === 'linux') {
      return {
        name: 'Linux VPS',
        status: 'Active',
        icon: '🐧'
      };
    } else if (process.platform === 'darwin') {
      return {
        name: 'MacOS',
        status: 'Active',
        icon: '🍎'
      };
    } else {
      return {
        name: 'Local Machine',
        status: 'Active',
        icon: '🏠'
      };
    }
  };
  
  // Get current time and date
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Load bot information using helper functions
  const botName = getBotName();
  const ownerName = getOwnerName();
  const botPrefix = getBotPrefix();
  const botVersion = getBotVersion();
  const botMode = getBotMode();
  const deploymentPlatform = getDeploymentPlatform();
  
  // Add bot name header before the info section
  let infoSection = `> *🐺 ${botName} 🐺*\n`;
  
  // Add info section only if any field is enabled
  const fieldsStatus = getAllFieldsStatus(style);
  
  // ========== FIX: Add safety check for fieldsStatus ==========
  let hasInfoFields = false;
  if (fieldsStatus && typeof fieldsStatus === 'object') {
    hasInfoFields = Object.values(fieldsStatus).some(val => val);
  } else {
    // If getAllFieldsStatus doesn't exist or returns invalid, show all info
    hasInfoFields = true;
  }
  
  if (hasInfoFields) {
    const start = performance.now();
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const mnt = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${h}h ${mnt}m ${s}s`;
    const speed = (performance.now() - start).toFixed(2);
    const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(0);
    
    // SAFE CALCULATION: Prevent negative or invalid percentages
    const memPercentNum = ((usedMem / (totalMem * 1024)) * 100);
    const memPercent = Math.min(Math.max(parseFloat(memPercentNum.toFixed(0)), 0), 100);
    
    // SAFE BAR CALCULATION: Prevent negative repeat values
    const filledBars = Math.max(Math.floor(memPercent / 10), 0);
    const emptyBars = Math.max(10 - filledBars, 0);
    const memBar = "█".repeat(filledBars) + "░".repeat(emptyBars);
    
    // Calculate command speed in milliseconds
    const commandSpeed = `${speed}ms`;
    
    const infoLines = [];
    
    // ========== FIX: Check each field individually ==========
    if ((fieldsStatus && fieldsStatus.time) || (!fieldsStatus)) infoLines.push(`> ┃ Date: ${currentDate}`);
    if ((fieldsStatus && fieldsStatus.time) || (!fieldsStatus)) infoLines.push(`> ┃ Time: ${currentTime}`);
    if ((fieldsStatus && fieldsStatus.user) || (!fieldsStatus)) infoLines.push(`> ┃ User: ${m.pushName || "Anonymous"}`);
    if ((fieldsStatus && fieldsStatus.owner) || (!fieldsStatus)) infoLines.push(`> ┃ Owner: ${ownerName}`);
    if ((fieldsStatus && fieldsStatus.mode) || (!fieldsStatus)) infoLines.push(`> ┃ Mode: ${botMode}`);
    if ((fieldsStatus && fieldsStatus.prefix) || (!fieldsStatus)) infoLines.push(`> ┃ Prefix: [ ${botPrefix} ]`);
    if ((fieldsStatus && fieldsStatus.version) || (!fieldsStatus)) infoLines.push(`> ┃ Version: ${botVersion}`);
    if ((fieldsStatus && fieldsStatus.host) || (!fieldsStatus)) {
      infoLines.push(`> ┃ Panel: ${deploymentPlatform.name}`);
      infoLines.push(`> ┃ Status: ${deploymentPlatform.status}`);
    }
    if ((fieldsStatus && fieldsStatus.speed) || (!fieldsStatus)) {
      infoLines.push(`> ┃ Speed: ${commandSpeed}`);
    }
    if ((fieldsStatus && fieldsStatus.uptime) || (!fieldsStatus)) infoLines.push(`> ┃ Uptime: ${uptimeStr}`);
    if ((fieldsStatus && fieldsStatus.usage) || (!fieldsStatus)) infoLines.push(`> ┃ Usage: ${usedMem} MB of ${totalMem} GB`);
    if ((fieldsStatus && fieldsStatus.ram) || (!fieldsStatus)) infoLines.push(`> ┃ RAM: ${memBar} ${memPercent}%`);

    if (infoLines.length > 0) {
      const infoText = `> ┌────────────────\n${infoLines.join('\n')}\n> └────────────────\n`;
      infoSection += infoText;
    }
  } else {
    // If no info fields are enabled, still show basic header
    infoSection += `> *No additional information is enabled.*\n> *Use .togglemenuinfo to customize*\n`;
  }

  const commandsText = `> ┌────────────────
> │ 🏠 *GROUP MANAGEMENT* 🏠 
> ├────────────────
> │ 🛡️ *ADMIN & MODERATION* 🛡️ 
> ├────────────────
> │ • add                     
> │ • promote                 
> │ • demote                  
> │ • kick                    
> │ • kickall                 
> │ • ban                     
> │ • unban                   
> │ • banlist                 
> │ • clearbanlist            
> │ • warn                    
> │ • resetwarn               
> │ • setwarn                 
> │ • mute                    
> │ • unmute                  
> │ • gctime                  
> │ • antileave               
> │ • antilink                
> │ • welcome                 
> ├────────────────
> │ 🚫 *AUTO-MODERATION* 🚫   
> ├────────────────
> │ • antisticker             
> │ • antiviewonce  
> │ • antilink  
> │ • antiimage
> │ • antivideo
> │ • antiaudio
> │ • antimention
> │ • antistatusmention  
> │ • antigrouplink
> ├────────────────
> │ 📊 *GROUP INFO & TOOLS* 📊 
> ├────────────────
> │ • groupinfo               
> │ • tagadmin                
> │ • tagall                  
> │ • hidetag                 
> │ • link                    
> │ • invite                  
> │ • revoke                  
> │ • setdesc                 
> │ • fangtrace               
> │ • getgpp                  
> └────────────────

> ┌────────────────
> │ 🎨 *MENU COMMANDS* 🎨
> ├────────────────
> │ • togglemenuinfo
> │ • setmenuimage
> │ • resetmenuinfo
> │ • menustyle
> └────────────────

> ┌────────────────
> │ 👑 *OWNER CONTROLS* 👑    
> ├────────────────
> │ ⚡ *CORE MANAGEMENT* ⚡    
> ├────────────────
> │ • setbotname              
> │ • setowner                
> │ • setprefix               
> │ • iamowner                
> │ • about                   
> │ • block                   
> │ • unblock                 
> │ • blockdetect             
> │ • silent                  
> │ • anticall                
> │ • mode                    
> │ • online                  
> │ • setpp                   
> │ • repo                    
> ├────────────────
> │ 🔄 *SYSTEM & MAINTENANCE* 🛠️ 
> ├────────────────
> │ • restart                 
> │ • workingreload           
> │ • reloadenv               
> │ • getsettings             
> │ • setsetting              
> │ • test                    
> │ • disk                    
> │ • hostip                  
> │ • findcommands            
> └────────────────

> ┌────────────────
> │ ⚙️ *AUTOMATION* ⚙️
> ├────────────────
> │ • autoread                
> │ • autotyping              
> │ • autorecording           
> │ • autoreact               
> │ • autoreactstatus         
> │ • autobio                 
> │ • autorec                 
> └────────────────

> ┌────────────────
> │ ✨ *GENERAL UTILITIES* ✨
> ├────────────────
> │ 🔍 *INFO & SEARCH* 🔎
> ├────────────────
> │ • alive
> │ • ping
> │ • ping2
> │ • time
> │ • connection
> │ • define
> │ • news
> │ • covid
> │ • iplookup
> │ • getip
> │ • getpp
> │ • getgpp
> │ • prefixinfo
> ├───────────────
> │ 🔗 *CONVERSION & MEDIA* 📁
> ├───────────────
> │ • shorturl
> │ • qrencode
> │ • take
> │ • imgbb
> │ • tiktok
> │ • save
> ├───────────────
> │ 📝 *PERSONAL TOOLS* 📅
> ├───────────────
> │ • pair
> │ • resetwarn
> │ • setwarn
> └────────────────

> ┌────────────────
> │ 🎵 *MUSIC & MEDIA* 🎶
> ├────────────────
> │ • play                    
> │ • song                    
> │ • lyrics                  
> │ • spotify                 
> │ • video                   
> │ • video2                  
> │ • bassboost               
> │ • trebleboost             
> └────────────────

> ┌───────────────
> │ 🤖 *MEDIA & AI COMMANDS* 🧠 
> ├───────────────
> │ ⬇️ *MEDIA DOWNLOADS* 📥     
> ├───────────────
> │ • youtube                 
> │ • tiktok                 
> │ • instagram               
> │ • facebook                
> │ • snapchat                
> │ • apk                     
> ├───────────────
> │ 🎨 *AI GENERATION* 💡    
> ├───────────────
> │ • gpt                     
> │ • gemini                  
> │ • deepseek                
> │ • deepseek+               
> │ • analyze                 
> │ • suno                    
> │ • wolfbot                 
> │ • videogen                
> └───────────────

> ┌───────────────
> │ 🖼️ *IMAGE TOOLS* 🖼️
> ├───────────────
> │ • image                   
> │ • imagegenerate           
> │ • anime                   
> │ • art                     
> │ • real                    
> └───────────────

> ┌───────────────
> │ 🛡️ *SECURITY & HACKING* 🔒 
> ├───────────────
> │ 🌐 *NETWORK & INFO* 📡   
> ├───────────────
> │ • ipinfo                  
> │ • shodan                  
> │ • iplookup                
> │ • getip                   
> └───────────────

> ┌────────────────
> │ 🎨 *LOGO DESIGN STUDIO* 🎨
> ├────────────────
> │ 🌟 *PREMIUM METALS* 🌟    
> ├────────────────
> │ • goldlogo                
> │ • silverlogo              
> │ • platinumlogo            
> │ • chromelogo              
> │ • diamondlogo             
> │ • bronzelogo              
> │ • steelogo                
> │ • copperlogo              
> │ • titaniumlogo            
> ├────────────────
> │ 🔥 *ELEMENTAL EFFECTS* 🔥  
> ├────────────────
> │ • firelogo                
> │ • icelogo                 
> │ • iceglowlogo             
> │ • lightninglogo           
> │ • aqualogo                
> │ • rainbowlogo             
> │ • sunlogo                 
> │ • moonlogo                
> ├────────────────
> │ 🎭 *MYTHICAL & MAGICAL* 🧙  
> ├────────────────
> │ • dragonlogo              
> │ • phoenixlogo             
> │ • wizardlogo              
> │ • crystallogo             
> │ • darkmagiclogo           
> ├────────────────
> │ 🌌 *DARK & GOTHIC* 🌑     
> ├────────────────
> │ • shadowlogo              
> │ • smokelogo               
> │ • bloodlogo               
> ├────────────────
> │ 💫 *GLOW & NEON EFFECTS* 🌈  
> ├────────────────
> │ • neonlogo                
> │ • glowlogo                
> ├────────────────
> │ 🤖 *TECH & FUTURISTIC* 🚀  
> ├────────────────
> │ • matrixlogo              
> └────────────────

> ┌────────────────
> │ 🐙 *GITHUB COMMANDS* 🐙
> ├────────────────
> │ • gitclone
> │ • gitinfo
> │ • repo
> │ • commits
> │ • stars
> │ • watchers
> │ • release
> └────────────────

> ┌────────────────
> │ 🌸 *ANIME COMMANDS* 🌸
> ├────────────────
> │ • awoo
> │ • bj
> │ • bully
> │ • cringe
> │ • cry
> │ • cuddle
> │ • dance
> │ • glomp
> │ • highfive
> │ • kill
> │ • kiss
> │ • lick
> │ • megumin
> │ • neko
> │ • pat
> │ • shinobu
> │ • trap
> │ • trap2
> │ • waifu
> │ • wink
> │ • yeet
> └────────────────

> 🐺*POWERED BY WOLF TECH*🐺
`;

  // ========== APPLY "READ MORE" EFFECT ==========
  // Combine info section (visible) and commands (hidden) with "Read more"
  finalText = createReadMoreEffect(infoSection, commandsText);
  // ========== END "READ MORE" EFFECT ==========

  await sock.sendMessage(jid, { text: finalText }, { quoted: m });
  console.log(`✅ Text menu sent with "Read more" effect`);
  break;
}









// case 5: {
//   // 📝 Full info + commands (with individual toggles)
//   let finalText = "";
  
//   // ========== ADD "READ MORE" HELPER FUNCTION ==========
//   const createReadMoreEffect = (text1, text2) => {
//     /**
//      * Creates WhatsApp's "Read more" effect using invisible characters
//      * @param {string} text1 - First part (visible before "Read more")
//      * @param {string} text2 - Second part (hidden after "Read more")
//      * @returns {string} Formatted text with "Read more" effect
//      */
    
//     // WhatsApp needs MORE invisible characters to trigger "Read more"
//     // Use 500+ characters for better reliability
//     const invisibleChars = [
//       '\u200E',    // LEFT-TO-RIGHT MARK
//       '\u200F',    // RIGHT-TO-LEFT MARK
//       '\u200B',    // ZERO WIDTH SPACE
//       '\u200C',    // ZERO WIDTH NON-JOINER
//       '\u200D',    // ZERO WIDTH JOINER
//       '\u2060',    // WORD JOINER
//       '\uFEFF',    // ZERO WIDTH NO-BREAK SPACE
//     ];
    
//     // Create a LONG string of invisible characters (500-600 chars)
//     // WhatsApp needs enough to break the line detection
//     const invisibleString = Array.from({ length: 550 }, 
//       (_, i) => invisibleChars[i % invisibleChars.length]
//     ).join('');
    
//     // Add a newline after invisible characters for cleaner break
//     return `${text1}${invisibleString}\n${text2}`;
//   };
//   // ========== END OF HELPER FUNCTION ==========
  
//   // Add these helper functions at the start of case 5 (same as case 7)
//   const getBotMode = () => {
//     try {
//       const possiblePaths = [
//         './bot_mode.json',
//         path.join(__dirname, 'bot_mode.json'),
//         path.join(__dirname, '../bot_mode.json'),
//         path.join(__dirname, '../../bot_mode.json'),
//         path.join(__dirname, '../../../bot_mode.json'),
//         path.join(__dirname, '../commands/owner/bot_mode.json'),
//       ];
      
//       for (const modePath of possiblePaths) {
//         if (fs.existsSync(modePath)) {
//           try {
//             const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
            
//             if (modeData.mode) {
//               let displayMode;
//               switch(modeData.mode.toLowerCase()) {
//                 case 'public':
//                   displayMode = '🌍 Public';
//                   break;
//                 case 'silent':
//                   displayMode = '🔇 Silent';
//                   break;
//                 case 'private':
//                   displayMode = '🔒 Private';
//                   break;
//                 case 'group-only':
//                   displayMode = '👥 Group Only';
//                   break;
//                 case 'maintenance':
//                   displayMode = '🛠️ Maintenance';
//                   break;
//                 default:
//                   displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
//               }
//               return displayMode;
//             }
//           } catch (parseError) {}
//         }
//       }
      
//       // Fallback to global variables
//       if (global.BOT_MODE) {
//         return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
//       }
//       if (global.mode) {
//         return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
//       }
//       if (process.env.BOT_MODE) {
//         return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
//       }
      
//     } catch (error) {}
    
//     return '🌍 Public';
//   };
  
//   const getBotName = () => {
//     try {
//       const possiblePaths = [
//         './bot_settings.json',
//         path.join(__dirname, 'bot_settings.json'),
//         path.join(__dirname, '../bot_settings.json'),
//         path.join(__dirname, '../../bot_settings.json'),
//         path.join(__dirname, '../../../bot_settings.json'),
//         path.join(__dirname, '../commands/owner/bot_settings.json'),
//       ];
      
//       for (const settingsPath of possiblePaths) {
//         if (fs.existsSync(settingsPath)) {
//           try {
//             const settingsData = fs.readFileSync(settingsPath, 'utf8');
//             const settings = JSON.parse(settingsData);
            
//             if (settings.botName && settings.botName.trim() !== '') {
//               return settings.botName.trim();
//             }
//           } catch (parseError) {}
//         }
//       }
      
//       if (global.BOT_NAME) {
//         return global.BOT_NAME;
//       }
      
//       if (process.env.BOT_NAME) {
//         return process.env.BOT_NAME;
//       }
      
//     } catch (error) {}
    
//     return 'WOLFBOT';
//   };
  
//   const getOwnerName = () => {
//     try {
//       const botSettingsPaths = [
//         './bot_settings.json',
//         path.join(__dirname, 'bot_settings.json'),
//         path.join(__dirname, '../bot_settings.json'),
//         path.join(__dirname, '../../bot_settings.json'),
//       ];
      
//       for (const settingsPath of botSettingsPaths) {
//         if (fs.existsSync(settingsPath)) {
//           try {
//             const settingsData = fs.readFileSync(settingsPath, 'utf8');
//             const settings = JSON.parse(settingsData);
            
//             if (settings.ownerName && settings.ownerName.trim() !== '') {
//               return settings.ownerName.trim();
//             }
//           } catch (parseError) {}
//         }
//       }
      
//       const ownerPath = path.join(__dirname, 'owner.json');
//       if (fs.existsSync(ownerPath)) {
//         const ownerData = fs.readFileSync(ownerPath, 'utf8');
//         const ownerInfo = JSON.parse(ownerData);
        
//         if (ownerInfo.owner && ownerInfo.owner.trim() !== '') {
//           return ownerInfo.owner.trim();
//         } else if (ownerInfo.number && ownerInfo.number.trim() !== '') {
//           return ownerInfo.number.trim();
//         } else if (ownerInfo.phone && ownerInfo.phone.trim() !== '') {
//           return ownerInfo.phone.trim();
//         } else if (ownerInfo.contact && ownerInfo.contact.trim() !== '') {
//           return ownerInfo.contact.trim();
//         } else if (Array.isArray(ownerInfo) && ownerInfo.length > 0) {
//           const owner = typeof ownerInfo[0] === 'string' ? ownerInfo[0] : "Unknown";
//           return owner;
//         }
//       }
      
//       if (global.OWNER_NAME) {
//         return global.OWNER_NAME;
//       }
//       if (global.owner) {
//         return global.owner;
//       }
//       if (process.env.OWNER_NUMBER) {
//         return process.env.OWNER_NUMBER;
//       }
      
//     } catch (error) {}
    
//     return 'Unknown';
//   };
  
//   const getBotPrefix = () => {
//     try {
//       const botSettingsPaths = [
//         './bot_settings.json',
//         path.join(__dirname, 'bot_settings.json'),
//         path.join(__dirname, '../bot_settings.json'),
//         path.join(__dirname, '../../bot_settings.json'),
//       ];
      
//       for (const settingsPath of botSettingsPaths) {
//         if (fs.existsSync(settingsPath)) {
//           try {
//             const settingsData = fs.readFileSync(settingsPath, 'utf8');
//             const settings = JSON.parse(settingsData);
            
//             if (settings.prefix && settings.prefix.trim() !== '') {
//               return settings.prefix.trim();
//             }
//           } catch (parseError) {}
//         }
//       }
      
//       if (global.prefix) {
//         return global.prefix;
//       }
      
//       if (process.env.PREFIX) {
//         return process.env.PREFIX;
//       }
      
//     } catch (error) {}
    
//     return '.';
//   };
  
//   const getBotVersion = () => {
//     try {
//       const ownerPath = path.join(__dirname, 'owner.json');
//       if (fs.existsSync(ownerPath)) {
//         const ownerData = fs.readFileSync(ownerPath, 'utf8');
//         const ownerInfo = JSON.parse(ownerData);
        
//         if (ownerInfo.version && ownerInfo.version.trim() !== '') {
//           return ownerInfo.version.trim();
//         }
//       }
      
//       const botSettingsPaths = [
//         './bot_settings.json',
//         path.join(__dirname, 'bot_settings.json'),
//         path.join(__dirname, '../bot_settings.json'),
//       ];
      
//       for (const settingsPath of botSettingsPaths) {
//         if (fs.existsSync(settingsPath)) {
//           try {
//             const settingsData = fs.readFileSync(settingsPath, 'utf8');
//             const settings = JSON.parse(settingsData);
            
//             if (settings.version && settings.version.trim() !== '') {
//               return settings.version.trim();
//             }
//           } catch (parseError) {}
//         }
//       }
      
//       if (global.VERSION) {
//         return global.VERSION;
//       }
      
//       if (global.version) {
//         return global.version;
//       }
      
//       if (process.env.VERSION) {
//         return process.env.VERSION;
//       }
      
//     } catch (error) {}
    
//     return 'v1.0.0';
//   };
  
//   const getDeploymentPlatform = () => {
//     // Detect deployment platform
//     if (process.env.REPL_ID || process.env.REPLIT_DB_URL) {
//       return {
//         name: 'Replit',
//         status: 'Active',
//         icon: '🌀'
//       };
//     } else if (process.env.HEROKU_APP_NAME) {
//       return {
//         name: 'Heroku',
//         status: 'Active',
//         icon: '🦸'
//       };
//     } else if (process.env.RENDER_SERVICE_ID) {
//       return {
//         name: 'Render',
//         status: 'Active',
//         icon: '⚡'
//       };
//     } else if (process.env.RAILWAY_ENVIRONMENT) {
//       return {
//         name: 'Railway',
//         status: 'Active',
//         icon: '🚂'
//       };
//     } else if (process.env.VERCEL) {
//       return {
//         name: 'Vercel',
//         status: 'Active',
//         icon: '▲'
//       };
//     } else if (process.env.GLITCH_PROJECT_REMIX) {
//       return {
//         name: 'Glitch',
//         status: 'Active',
//         icon: '🎏'
//       };
//     } else if (process.env.KOYEB) {
//       return {
//         name: 'Koyeb',
//         status: 'Active',
//         icon: '☁️'
//       };
//     } else if (process.env.CYCLIC_URL) {
//       return {
//         name: 'Cyclic',
//         status: 'Active',
//         icon: '🔄'
//       };
//     } else if (process.env.PANEL) {
//       return {
//         name: 'PteroPanel',
//         status: 'Active',
//         icon: '🖥️'
//       };
//     } else if (process.env.SSH_CONNECTION || process.env.SSH_CLIENT) {
//       return {
//         name: 'VPS/SSH',
//         status: 'Active',
//         icon: '🖥️'
//       };
//     } else if (process.platform === 'win32') {
//       return {
//         name: 'Windows PC',
//         status: 'Active',
//         icon: '💻'
//       };
//     } else if (process.platform === 'linux') {
//       return {
//         name: 'Linux VPS',
//         status: 'Active',
//         icon: '🐧'
//       };
//     } else if (process.platform === 'darwin') {
//       return {
//         name: 'MacOS',
//         status: 'Active',
//         icon: '🍎'
//       };
//     } else {
//       return {
//         name: 'Local Machine',
//         status: 'Active',
//         icon: '🏠'
//       };
//     }
//   };
  
//   // Get current time and date
//   const now = new Date();
//   const currentTime = now.toLocaleTimeString('en-US', { 
//     hour12: true, 
//     hour: '2-digit', 
//     minute: '2-digit',
//     second: '2-digit'
//   });
  
//   const currentDate = now.toLocaleDateString('en-US', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
  
//   // Load bot information using helper functions
//   const botName = getBotName();
//   const ownerName = getOwnerName();
//   const botPrefix = getBotPrefix();
//   const botVersion = getBotVersion();
//   const botMode = getBotMode();
//   const deploymentPlatform = getDeploymentPlatform();
  
//   // Add bot name header before the info section
//   let infoSection = `> *🐺 ${botName} 🐺*\n`;
  
//   // Add info section only if any field is enabled
//   const fieldsStatus = getAllFieldsStatus(style);
  
//   // ========== FIX: Add safety check for fieldsStatus ==========
//   let hasInfoFields = false;
//   if (fieldsStatus && typeof fieldsStatus === 'object') {
//     hasInfoFields = Object.values(fieldsStatus).some(val => val);
//   } else {
//     // If getAllFieldsStatus doesn't exist or returns invalid, show all info
//     hasInfoFields = true;
//   }
  
//   if (hasInfoFields) {
//     const start = performance.now();
//     const uptime = process.uptime();
//     const h = Math.floor(uptime / 3600);
//     const mnt = Math.floor((uptime % 3600) / 60);
//     const s = Math.floor(uptime % 60);
//     const uptimeStr = `${h}h ${mnt}m ${s}s`;
//     const speed = (performance.now() - start).toFixed(2);
//     const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
//     const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(0);
    
//     // SAFE CALCULATION: Prevent negative or invalid percentages
//     const memPercentNum = ((usedMem / (totalMem * 1024)) * 100);
//     const memPercent = Math.min(Math.max(parseFloat(memPercentNum.toFixed(0)), 0), 100);
    
//     // SAFE BAR CALCULATION: Prevent negative repeat values
//     const filledBars = Math.max(Math.floor(memPercent / 10), 0);
//     const emptyBars = Math.max(10 - filledBars, 0);
//     const memBar = "█".repeat(filledBars) + "░".repeat(emptyBars);
    
//     // Calculate command speed in milliseconds
//     const commandSpeed = `${speed}ms`;
    
//     const infoLines = [];
    
//     // ========== FIX: Check each field individually ==========
//     if ((fieldsStatus && fieldsStatus.time) || (!fieldsStatus)) infoLines.push(`> ┃ ᴰᵃᵗᵉ: ${currentDate}`);
//     if ((fieldsStatus && fieldsStatus.time) || (!fieldsStatus)) infoLines.push(`> ┃ ᵀⁱᵐᵉ: ${currentTime}`);
//     if ((fieldsStatus && fieldsStatus.user) || (!fieldsStatus)) infoLines.push(`> ┃ ᵁˢᵉʳ: ${m.pushName || "Anonymous"}`);
//     if ((fieldsStatus && fieldsStatus.owner) || (!fieldsStatus)) infoLines.push(`> ┃ ᵒʷⁿᵉʳ: ${ownerName}`);
//     if ((fieldsStatus && fieldsStatus.mode) || (!fieldsStatus)) infoLines.push(`> ┃ ᴹᵒᵈᵉ: ${botMode}`);
//     if ((fieldsStatus && fieldsStatus.prefix) || (!fieldsStatus)) infoLines.push(`> ┃ ᴾʳᵉᶠⁱˣ : [ ${botPrefix} ]`);
//     if ((fieldsStatus && fieldsStatus.version) || (!fieldsStatus)) infoLines.push(`> ┃ ⱽᵉʳˢⁱᵒⁿ:: ${botVersion}`);
//     if ((fieldsStatus && fieldsStatus.host) || (!fieldsStatus)) {
//       infoLines.push(`> ┃ ᴾᵃⁿᵉˡ: ${deploymentPlatform.name}`);
//       infoLines.push(`> ┃ ˢᵗᵃᵗᵘˢ: ${deploymentPlatform.status}`);
//     }
//     if ((fieldsStatus && fieldsStatus.speed) || (!fieldsStatus)) {
//       infoLines.push(`> ┃ ˢᵖᵉᵉᵈ: ${commandSpeed}`);
//     }
//     if ((fieldsStatus && fieldsStatus.uptime) || (!fieldsStatus)) infoLines.push(`> ┃ ᵁᵖᵗⁱᵐᵉ: ${uptimeStr}`);
//     if ((fieldsStatus && fieldsStatus.usage) || (!fieldsStatus)) infoLines.push(`> ┃ ᵁˢᵃᵍᵉ: ${usedMem} MB of ${totalMem} GB`);
//     if ((fieldsStatus && fieldsStatus.ram) || (!fieldsStatus)) infoLines.push(`> ┃ ᴿᴬᴹ: ${memBar} ${memPercent}%`);

//     if (infoLines.length > 0) {
//       const infoText = `> ┌────────────────\n${infoLines.join('\n')}\n> └────────────────\n`;
//       infoSection += infoText;
//     }
//   } else {
//     // If no info fields are enabled, still show basic header
//     infoSection += `> *No additional information is enabled.*\n> *Use .togglemenuinfo to customize*\n`;
//   }

//   const commandsText = `> ┌────────────────
// > │ 🏠 ɢʀᴏᴜᴘ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ 🏠 
// > ├────────────────
// > │ 🛡️ ᴀᴅᴍɪɴ & ᴍᴏᴅᴇʀᴀᴛɪᴏɴ 🛡️ 
// > ├────────────────
// > │ • ᵃᵈᵈ                     
// > │ • ᵖʳᵒᵐᵒᵗᵉ                 
// > │ • ᵈᵉᵐᵒᵗᵉ                  
// > │ • ᵏⁱᶜᵏ                    
// > │ • ᵏⁱᶜᵏᵃˡˡ                 
// > │ • ᵇᵃⁿ                     
// > │ • ᵘⁿᵇᵃⁿ                   
// > │ • ᵇᵃⁿˡⁱˢᵗ                 
// > │ • ᶜˡᵉᵃʳᵇᵃⁿˡⁱˢᵗ            
// > │ • ʷᵃʳⁿ                    
// > │ • ʳᵉˢᵗʷᵃʳⁿ               
// > │ • ˢᵉᵗʷᵃʳⁿ                 
// > │ • ᵐᵘᵗᵉ                    
// > │ • ᵘⁿᴍᵘᵗᵉ                  
// > │ • ᵍᶜᵗⁱᵐᵉ                  
// > │ • ᵃⁿᵗⁱˡᵉᵃᵛᵉ               
// > │ • ᵃⁿᵗⁱˡⁱⁿᵏ                
// > │ • ʷᵉˡᶜᵒᴍᵉ                 
// > ├────────────────
// > │ 🚫 ᴀᴜᴛᴏ-ᴍᴏᴅᴇʀᴀᴛɪᴏɴ 🚫   
// > ├────────────────
// > │ • ᵃⁿᵗⁱˢᵗⁱᶜᵏᵉʳ             
// > │ • ᵃⁿᵗⁱᵛⁱᵉʷᵒⁿᶜᵉ  
// > │ • ᵃⁿᵗⁱˡⁱⁿᵏ  
// > │ • ᵃⁿᵗⁱⁱᴍᵃᵍᵉ
// > │ • ᵃⁿᵗⁱᵛⁱᵈᵉᵒ
// > │ • ᵃⁿᵗⁱᵃᵘᵈⁱᵒ
// > │ • ᵃⁿᵗⁱᴍᵉⁿᵗⁱᵒⁿ
// > │ • ᵃⁿᵗⁱˢᵗᴀᵗᵘˢᴍᵉⁿᵗⁱᵒⁿ  
// > │ • ᵃⁿᵗⁱɢʳᵒᵘᵖˡⁱⁿᵏ
// > ├────────────────
// > │ 📊 ɢʀᴏᴜᴘ ɪɴꜰᴏ & ᴛᴏᴏʟs 📊 
// > ├────────────────
// > │ • ᵍʳᵒᵘᵖⁱⁿᶠᵒ               
// > │ • ᵗᵃᵍᵃᵈᴍⁱⁿ                
// > │ • ᵗᵃᵍᵃʟʟ                  
// > │ • ʰⁱᵈᵉᵗᵃᵍ                 
// > │ • ˡⁱⁿᵏ                    
// > │ • ⁱⁿᵛⁱᵗᵉ                  
// > │ • ʳᵉᵛᵒᴋᵉ                  
// > │ • ˢᵉᵗᴅᵉˢᶜ                 
// > │ • ᶠᵃⁿᵍᵗʳᵃᶜᵉ               
// > │ • ᵍᵉᵗᵍᵖᵖ                  
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ 🎨 ᴍᴇɴᴜ ᴄᴏᴍᴍᴀɴᴅs 🎨
// > ├────────────────
// > │ • ᵗᵒᵍᵍˡᵉᴍᵉⁿᵘⁱⁿᶠᵒ
// > │ • ˢᵉᵗᵐᵉⁿᵘⁱᴍᵃᵍᵉ
// > │ • ʳᵉˢᵉᵗᵐᵉⁿᵘⁱⁿᶠᵒ
// > │ • ᵐᵉⁿᵘˢᵗʸˡᵉ
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ 👑 ᴏᴡɴᴇʀ ᴄᴏɴᴛʀᴏʟs 👑    
// > ├────────────────
// > │ ⚡ ᴄᴏʀᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ⚡    
// > ├────────────────
// > │ • ˢᵉᵗᵇᵒᵗⁿᵃᵐᵉ              
// > │ • ˢᵉᵗᵒʷⁿᵉʳ                
// > │ • ˢᵉᵗᵖʳᵉᶠⁱˣ               
// > │ • ⁱᵃᴍᵒʷⁿᵉʳ                
// > │ • ᵃᵇᵒᵘᵗ                   
// > │ • ᵇˡᵒᶜᵏ                   
// > │ • ᵘⁿᵇˡᵒᶜᵏ                 
// > │ • ᵇˡᵒᶜᵏᵈᵉᵗᵉᶜᵗ             
// > │ • ˢⁱˡᵉⁿᵗ                  
// > │ • ᵃⁿᵗⁱᶜᵃˡˡ                
// > │ • ᵐᵒᵈᵉ                    
// > │ • ᵒⁿˡⁱⁿᵉ                  
// > │ • ˢᵉᵗᵖᵖ                   
// > │ • ʳᵉᵖᵒ                    
// > ├────────────────
// > │ 🔄 sʏsᴛᴇᴍ & ᴍᴀɪɴᴛᴇɴᴀɴᴄᴇ 🛠️ 
// > ├────────────────
// > │ • ʳᵉˢᴛᵃʳᴛ                 
// > │ • ʷᵒʳᵏⁱⁿᵍʳᵉˡᵒᵃᵈ           
// > │ • ʳᵉʟᵒᵃᵈᵉⁿᵛ               
// > │ • ᵍᵉᵗˢᵉᵗᴛⁱⁿᵍˢ             
// > │ • ˢᵉᵗˢᵉᵗᴛⁱⁿᵍ              
// > │ • ᵗᵉˢᵗ                    
// > │ • ᵈⁱˢᵏ                    
// > │ • ʰᵒˢᵗⁱᵖ                  
// > │ • ᶠⁱⁿᵈᶜᵒᴍᴍᵃⁿᵈˢ            
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ ⚙️ ᴀᴜᴛᴏᴍᴀᴛɪᴏɴ ⚙️
// > ├────────────────
// > │ • ᵃᵘᵗᵒʳᵉᵃᵈ                
// > │ • ᵃᵘᵗᵒᵗʏᵖⁱⁿᵍ              
// > │ • ᵃᵘᵗᵒʳᵉᶜᵒʳᵈⁱⁿᵍ           
// > │ • ᵃᵘᵗᵒʳᵉᵃᶜᵗ               
// > │ • ᵃᵘᵗᵒʳᵉᵃᶜᵗˢᵗᴀᵗᵘˢ         
// > │ • ᵃᵘᵗᵒʙɪᵒ                 
// > │ • ᵃᵘᵗᵒʳᴇᶜ                 
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ ✨ ɢᴇɴᴇʀᴀʟ ᴜᴛɪʟɪᴛɪᴇs ✨
// > ├────────────────
// > │ 🔍 ɪɴꜰᴏ & sᴇᴀʀᴄʜ 🔎
// > ├────────────────
// > │ • ᵃˡⁱᵛᵉ
// > │ • ᵖⁱⁿᵍ
// > │ • ᵖⁱⁿᵍ²
// > │ • ᵗⁱᵐᵉ
// > │ • ᴄᴏⁿⁿᵉᴄᴛɪᵒⁿ
// > │ • ᴅᵉᶠⁱⁿᵉ
// > │ • ⁿᵉʷˢ
// > │ • ᶜᵒᵛⁱᵈ
// > │ • ⁱᵖˡᵒᵒᵏᵘᵖ
// > │ • ᵍᵉᵗⁱᵖ
// > │ • ᵍᵉᵗᵖᵖ
// > │ • ᵍᵉᵗᵍᵖᵖ
// > │ • ᵖʳᵉᶠⁱˣⁱⁿᶠᵒ
// > ├───────────────
// > │ 🔗 ᴄᴏɴᴠᴇʀsɪᴏɴ & ᴍᴇᴅɪᴀ 📁
// > ├───────────────
// > │ • ˢʰᵒʳᵗᵘʳˡ
// > │ • ᵠʳᵉⁿᶜᵒᵈᵉ
// > │ • ᵗᵃᴋᵉ
// > │ • ⁱᵐᵍᵇʙ
// > │ • ᵗⁱᵏᵗᵒᵏ
// > │ • ˢᵃᵛᵉ
// > ├───────────────
// > │ 📝 ᴘᴇʀsᴏɴᴀʟ ᴛᴏᴏʟs 📅
// > ├───────────────
// > │ • ᵖᵃⁱʳ
// > │ • ʳᵉˢᵉᵗʷᴀʳⁿ
// > │ • ˢᵉᵗʷᴀʳⁿ
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ 🎵 ᴍᴜsɪᴄ & ᴍᴇᴅɪᴀ 🎶
// > ├────────────────
// > │ • ᵖˡᵃʸ                    
// > │ • ˢᵒⁿᵍ                    
// > │ • ˡʸʳⁱᶜˢ                  
// > │ • ˢᵖᵒᵗⁱᶠʸ                
// > │ • ᵛⁱᵈᵉᵒ                  
// > │ • ᵛⁱᵈᵉᵒ²                  
// > │ • ᵇᵃˢˢᵇᵒᵒˢᵗ               
// > │ • ᵗʳᵉᵇˡᵉᵇᵒᵒˢᵗ             
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌───────────────
// > │ 🤖 ᴍᴇᴅɪᴀ & ᴀɪ ᴄᴏᴍᴍᴀɴᴅs 🧠 
// > ├───────────────
// > │ ⬇️ ᴍᴇᴅɪᴀ ᴅᴏᴡɴʟᴏᴀᴅs 📥     
// > ├───────────────
// > │ • ʸᵒᵘᵗᵘᵇᵉ                 
// > │ • ᵗⁱᵏᵗᵒᵏ                  
// > │ • ⁱⁿˢᵗᵃᵍʳᵃᴍ               
// > │ • ᶠᵃᶜᵉᵇᵒᵒᵏ                
// > │ • ˢⁿᵃᵖᶜʰᵃᵗ                
// > │ • ᵃᵖᵏ                     
// > ├───────────────
// > │ 🎨 ᴀɪ ɢᴇɴᴇʀᴀᴛɪᴏɴ 💡    
// > ├───────────────
// > │ • ᵍᵖᵗ                     
// > │ • ᵍᵉᵐⁱⁿⁱ                  
// > │ • ᵈᵉᵉᵖˢᵉᵉᵏ                
// > │ • ᵈᵉᵉᵖˢᵉᵉᵏ⁺               
// > │ • ᵃⁿᵃˡʸᶻᵉ                 
// > │ • ˢᵘⁿᵒ                    
// > │ • ʷᵒˡᶠᵇᵒᵗ                 
// > │ • ᵛⁱᵈᵉᵒᵍᵉⁿ                
// > └───────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌───────────────
// > │ 🖼️ ɪᴍᴀɢᴇ ᴛᴏᴏʟs 🖼️
// > ├───────────────
// > │ • ⁱᵐᵃᵍᵉ                   
// > │ • ⁱᵐᵃᵍᵉᵍᵉⁿᵉʳᵃᵗᵉ           
// > │ • ᵃⁿⁱᴍᵉ                   
// > │ • ᵃʳᵗ                     
// > │ • ʳᵉᵃˡ                    
// > └───────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌───────────────
// > │ 🛡️ sᴇᴄᴜʀɪᴛʏ & ʜᴀᴄᴋɪɴɢ 🔒 
// > ├───────────────
// > │ 🌐 ɴᴇᴛᴡᴏʀᴋ & ɪɴꜰᴏ 📡   
// > ├───────────────
// > │ • ⁱᵖⁱⁿᶠᵒ                   
// > │ • ˢʰᵒᵈᵃⁿ                  
// > │ • ⁱᵖˡᵒᵒᵏᵘᵖ                
// > │ • ᵍᵉᵗⁱᵖ                    
// > └───────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ 🎨 ʟᴏɢᴏ ᴅᴇsɪɢɴ sᴛᴜᴅɪᴏ 🎨
// > ├────────────────
// > │ 🌟 ᴘʀᴇᴍɪᴜᴍ ᴍᴇᴛᴀʟs 🌟    
// > ├────────────────
// > │ • ᵍᵒˡᵈˡᵒᵍᵒ                 
// > │ • ˢⁱˡᵛᵉʳˡᵒᵍᵒ               
// > │ • ᵖˡᵃᵗⁱⁿᵘᴍˡᵒᵍᵒ             
// > │ • ᶜʰʳᵒᴍᵉˡᵒᵍᵒ               
// > │ • ᵈⁱᵃᴍᵒⁿᵈˡᵒᵍᵒ              
// > │ • ᵇʳᵒⁿᶻᵉˡᵒᵍᵒ               
// > │ • ˢᵗᵉᵉˡᵒᵍᵒ                 
// > │ • ᶜᵒᵖᵖᵉʳˡᵒᵍᵒ               
// > │ • ᵗⁱᵗᵃⁿⁱᵘᵐˡᵒᵍᵒ             
// > ├────────────────
// > │ 🔥 ᴇʟᴇᴍᴇɴᴛᴀʟ ᴇꜰꜰᴇᴄᴛs 🔥  
// > ├────────────────
// > │ • ᶠⁱʳᵉˡᵒᵍᵒ                 
// > │ • ⁱᶜᵉˡᵒᵍᵒ                  
// > │ • ⁱᶜᵉᵍˡᵒʷˡᵒᵍᵒ              
// > │ • ˡⁱᵍʰᵗⁿⁱⁿᵍˡᵒᵍᵒ            
// > │ • ᵃᵠᵘᵃˡᵒᵍᵒ                 
// > │ • ʳᵃⁱⁿᵇʷˡᵒᵍᵒ               
// > │ • ˢᵘⁿˡᵒᵍᵒ                  
// > │ • ᵐᵒᵒⁿˡᵒᵍᵒ                 
// > ├────────────────
// > │ 🎭 ᴍʏᴛʜɪᴄᴀʟ & ᴍᴀɢɪᴄᴀʟ 🧙  
// > ├────────────────
// > │ • ᵈʳᵃᵍᵒⁿˡᵒᵍᵒ               
// > │ • ᵖʰᵒᵉⁿⁱˣˡᵒᵍᵒ              
// > │ • ʷⁱᶻᵃʳᵈˡᵒᵍᵒ               
// > │ • ᶜʳʸˢᵗᵃˡˡᵒᵍᵒ              
// > │ • ᵈᵃʳᵏᵐᵃᵍⁱᶜˡᵒᵍᵒ            
// > ├────────────────
// > │ 🌌 ᴅᴀʀᴋ & ɢᴏᴛʜɪᴄ 🌑      
// > ├────────────────
// > │ • ˢʰᵃᵈᵒʷˡᵒᵍᵒ               
// > │ • ˢᵐᵒᵏᵉˡᵒᵍᵒ                
// > │ • ᵇˡᵒᵒᵈˡᵒᵍᵒ                
// > ├────────────────
// > │ 💫 ɢʟᴏᴡ & ɴᴇᴏɴ ᴇꜰꜰᴇᴄᴛs 🌈  
// > ├────────────────
// > │ • ⁿᵉᵒⁿˡᵒᵍᵒ                 
// > │ • ᵍˡᵒʷˡᵒᵍᵒ                 
// > ├────────────────
// > │ 🤖 ᴛᴇᴄʜ & ꜰᴜᴛᴜʀɪsᴛɪᴄ 🚀  
// > ├────────────────
// > │ • ᵐᵃᵗʳⁱˣˡᵒᵍᵒ               
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ 🐙 ɢɪᴛʜᴜʙ ᴄᴏᴍᴍᴀɴᴅs 🐙
// > ├────────────────
// > │ • ᵍⁱᵗᶜˡᵒⁿᵉ
// > │ • ᵍⁱᵗⁱⁿᶠᵒ
// > │ • ʳᵉᵖᵒ
// > │ • ᶜᵒᵐᴍⁱᵗˢ
// > │ • ˢᵗᵃʳˢ
// > │ • ʷᵃᵗᶜʰᵉʳˢ
// > │ • ʳᵉˡᵉᵃˢᵉ
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > ┌────────────────
// > │ 🌸 ᴀɴɪᴍᴇ ᴄᴏᴍᴍᴀɴᴅs 🌸
// > ├────────────────
// > │ • ᵃʷᵒᵒ
// > │ • ᵇʲ
// > │ • ᵇᵘˡˡʸ
// > │ • ᶜʳⁱⁿᵍᵉ
// > │ • ᶜʳʸ
// > │ • ᶜᵘᵈᵈˡᵉ
// > │ • ᵈᵃⁿᶜᵉ
// > │ • ᵍˡᵒᴍᵖ
// > │ • ʰⁱᵍʰᶠⁱᵛᵉ
// > │ • ᵏⁱˡˡ
// > │ • ᵏⁱˢˢ
// > │ • ˡⁱᶜᵏ
// > │ • ᵐᵉᵍᵘᵐⁱⁿ
// > │ • ⁿᵉᵏᵒ
// > │ • ᵖᵃᵗ
// > │ • ˢʰⁱⁿᵒᵇᵘ
// > │ • ᵗʳᵃᵖ
// > │ • ᵗʳᵃᵖ²
// > │ • ʷᵃⁱᶠᵘ
// > │ • ʷⁱⁿᵏ
// > │ • ʸᵉᵉᵗ
// > └────────────────
// > ˢⁱˡᵉⁿᵗ ᵂᵒˡᶠ
// > 🐺*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴡᴏʟꜰ ᴛᴇᴄʜ*🐺
// `;

//   // ========== APPLY "READ MORE" EFFECT ==========
//   // Combine info section (visible) and commands (hidden) with "Read more"
//   finalText = createReadMoreEffect(infoSection, commandsText);
//   // ========== END "READ MORE" EFFECT ==========

//   await sock.sendMessage(jid, { text: finalText }, { quoted: m });
//   console.log(`✅ Text menu sent with "Read more" effect`);
//   break;
// }


case 6: {
  // 🖼️ Full info + image + commands (with individual toggles)
  let finalCaption = "";
  
  // ========== ENHANCED "READ MORE" HELPER FUNCTION ==========
  const createReadMoreEffect = (text1, text2) => {
    /**
     * Creates WhatsApp's "Read more" effect using invisible characters
     * Works on ALL screens: phones, tablets, laptops
     * @param {string} text1 - First part (visible before "Read more")
     * @param {string} text2 - Second part (hidden after "Read more")
     * @returns {string} Formatted text with "Read more" effect
     */
    
    // WhatsApp needs MORE invisible characters for wider screens (laptops/tablets)
    // Use 600+ characters for cross-device compatibility
    const invisibleChars = [
      '\u200E',    // LEFT-TO-RIGHT MARK
      '\u200F',    // RIGHT-TO-LEFT MARK
      '\u200B',    // ZERO WIDTH SPACE
      '\u200C',    // ZERO WIDTH NON-JOINER
      '\u200D',    // ZERO WIDTH JOINER
      '\u2060',    // WORD JOINER
      '\uFEFF',    // ZERO WIDTH NO-BREAK SPACE
      '\u180E',    // MONGOLIAN VOWEL SEPARATOR
      '\u202A',    // LEFT-TO-RIGHT EMBEDDING
      '\u202B',    // RIGHT-TO-LEFT EMBEDDING
      '\u202C',    // POP DIRECTIONAL FORMATTING
      '\u202D',    // LEFT-TO-RIGHT OVERRIDE
      '\u202E',    // RIGHT-TO-LEFT OVERRIDE
    ];
    
    // Create 650+ invisible characters for reliable "Read more" on all devices
    // Laptops have wider screens, need more characters to trigger the effect
    const invisibleString = Array.from({ length: 680 }, 
      (_, i) => invisibleChars[i % invisibleChars.length]
    ).join('');
    
    // Add multiple newlines after invisible characters for better cross-device compatibility
    return `${text1}${invisibleString}\n\n${text2}`;
  };
  // ========== END OF HELPER FUNCTION ==========
  
  // Add these helper functions at the start of case 6
  const getBotMode = () => {
    try {
      const possiblePaths = [
        './bot_mode.json',
        path.join(__dirname, 'bot_mode.json'),
        path.join(__dirname, '../bot_mode.json'),
        path.join(__dirname, '../../bot_mode.json'),
        path.join(__dirname, '../../../bot_mode.json'),
        path.join(__dirname, '../commands/owner/bot_mode.json'),
      ];
      
      for (const modePath of possiblePaths) {
        if (fs.existsSync(modePath)) {
          try {
            const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
            
            if (modeData.mode) {
              let displayMode;
              switch(modeData.mode.toLowerCase()) {
                case 'public':
                  displayMode = '🌍 Public';
                  break;
                case 'silent':
                  displayMode = '🔇 Silent';
                  break;
                case 'private':
                  displayMode = '🔒 Private';
                  break;
                case 'group-only':
                  displayMode = '👥 Group Only';
                  break;
                case 'maintenance':
                  displayMode = '🛠️ Maintenance';
                  break;
                default:
                  displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
              }
              return displayMode;
            }
          } catch (parseError) {}
        }
      }
      
      // Fallback to global variables
      if (global.BOT_MODE) {
        return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (global.mode) {
        return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (process.env.BOT_MODE) {
        return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      
    } catch (error) {}
    
    return '🌍 Public';
  };
  
  const getBotName = () => {
    try {
      const possiblePaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
        path.join(__dirname, '../../../bot_settings.json'),
        path.join(__dirname, '../commands/owner/bot_settings.json'),
      ];
      
      for (const settingsPath of possiblePaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.botName && settings.botName.trim() !== '') {
              return settings.botName.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.BOT_NAME) {
        return global.BOT_NAME;
      }
      
      if (process.env.BOT_NAME) {
        return process.env.BOT_NAME;
      }
      
    } catch (error) {}
    
    return 'WOLFBOT';
  };
  
  const getOwnerName = () => {
    try {
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.ownerName && settings.ownerName.trim() !== '') {
              return settings.ownerName.trim();
            }
          } catch (parseError) {}
        }
      }
      
      const ownerPath = path.join(__dirname, 'owner.json');
      if (fs.existsSync(ownerPath)) {
        const ownerData = fs.readFileSync(ownerPath, 'utf8');
        const ownerInfo = JSON.parse(ownerData);
        
        if (ownerInfo.owner && ownerInfo.owner.trim() !== '') {
          return ownerInfo.owner.trim();
        } else if (ownerInfo.number && ownerInfo.number.trim() !== '') {
          return ownerInfo.number.trim();
        } else if (ownerInfo.phone && ownerInfo.phone.trim() !== '') {
          return ownerInfo.phone.trim();
        } else if (ownerInfo.contact && ownerInfo.contact.trim() !== '') {
          return ownerInfo.contact.trim();
        } else if (Array.isArray(ownerInfo) && ownerInfo.length > 0) {
          const owner = typeof ownerInfo[0] === 'string' ? ownerInfo[0] : "Unknown";
          return owner;
        }
      }
      
      if (global.OWNER_NAME) {
        return global.OWNER_NAME;
      }
      if (global.owner) {
        return global.owner;
      }
      if (process.env.OWNER_NUMBER) {
        return process.env.OWNER_NUMBER;
      }
      
    } catch (error) {}
    
    return 'Unknown';
  };
  
  const getBotPrefix = () => {
    try {
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.prefix && settings.prefix.trim() !== '') {
              return settings.prefix.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.prefix) {
        return global.prefix;
      }
      
      if (process.env.PREFIX) {
        return process.env.PREFIX;
      }
      
    } catch (error) {}
    
    return '.';
  };
  
  const getBotVersion = () => {
    try {
      const ownerPath = path.join(__dirname, 'owner.json');
      if (fs.existsSync(ownerPath)) {
        const ownerData = fs.readFileSync(ownerPath, 'utf8');
        const ownerInfo = JSON.parse(ownerData);
        
        if (ownerInfo.version && ownerInfo.version.trim() !== '') {
          return ownerInfo.version.trim();
        }
      }
      
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.version && settings.version.trim() !== '') {
              return settings.version.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.VERSION) {
        return global.VERSION;
      }
      
      if (global.version) {
        return global.version;
      }
      
      if (process.env.VERSION) {
        return process.env.VERSION;
      }
      
    } catch (error) {}
    
    return 'v1.0.0';
  };
  
  const getDeploymentPlatform = () => {
    // Detect deployment platform
    if (process.env.REPL_ID || process.env.REPLIT_DB_URL) {
      return {
        name: 'Replit',
        status: 'Active',
        icon: '🌀'
      };
    } else if (process.env.HEROKU_APP_NAME) {
      return {
        name: 'Heroku',
        status: 'Active',
        icon: '🦸'
      };
    } else if (process.env.RENDER_SERVICE_ID) {
      return {
        name: 'Render',
        status: 'Active',
        icon: '⚡'
      };
    } else if (process.env.RAILWAY_ENVIRONMENT) {
      return {
        name: 'Railway',
        status: 'Active',
        icon: '🚂'
      };
    } else if (process.env.VERCEL) {
      return {
        name: 'Vercel',
        status: 'Active',
        icon: '▲'
      };
    } else if (process.env.GLITCH_PROJECT_REMIX) {
      return {
        name: 'Glitch',
        status: 'Active',
        icon: '🎏'
      };
    } else if (process.env.KOYEB) {
      return {
        name: 'Koyeb',
        status: 'Active',
        icon: '☁️'
      };
    } else if (process.env.CYCLIC_URL) {
      return {
        name: 'Cyclic',
        status: 'Active',
        icon: '🔄'
      };
    } else if (process.env.PANEL) {
      return {
        name: 'PteroPanel',
        status: 'Active',
        icon: '🖥️'
      };
    } else if (process.env.SSH_CONNECTION || process.env.SSH_CLIENT) {
      return {
        name: 'VPS/SSH',
        status: 'Active',
        icon: '🖥️'
      };
    } else if (process.platform === 'win32') {
      return {
        name: 'Windows PC',
        status: 'Active',
        icon: '💻'
      };
    } else if (process.platform === 'linux') {
      return {
        name: 'Linux VPS',
        status: 'Active',
        icon: '🐧'
      };
    } else if (process.platform === 'darwin') {
      return {
        name: 'MacOS',
        status: 'Active',
        icon: '🍎'
      };
    } else {
      return {
        name: 'Local Machine',
        status: 'Active',
        icon: '🏠'
      };
    }
  };
  
  // Get current time and date
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Load bot information using helper functions
  const botName = getBotName();
  const ownerName = getOwnerName();
  const botPrefix = getBotPrefix();
  const botVersion = getBotVersion();
  const botMode = getBotMode();
  const deploymentPlatform = getDeploymentPlatform();
  
  // Add bot name header before the info section
  let infoSection = `> 🐺🌕 *${botName}* 🌕🐺\n`;
  
  // Add info section only if any field is enabled
  const fieldsStatus = getAllFieldsStatus(style);
  
  // ========== CROSS-DEVICE COMPATIBILITY FIX ==========
  let hasInfoFields = false;
  if (fieldsStatus && typeof fieldsStatus === 'object') {
    hasInfoFields = Object.values(fieldsStatus).some(val => val);
  } else {
    // If getAllFieldsStatus doesn't exist or returns invalid, show all info
    hasInfoFields = true;
  }
  
  if (hasInfoFields) {
    const start = performance.now();
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const mnt = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${h}h ${mnt}m ${s}s`;
    const speed = (performance.now() - start).toFixed(2);
    const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(0);
    
    // SAFE CALCULATION: Prevent negative or invalid percentages
    const memPercentNum = ((usedMem / (totalMem * 1024)) * 100);
    const memPercent = Math.min(Math.max(parseFloat(memPercentNum.toFixed(0)), 0), 100);
    
    // SAFE BAR CALCULATION: Prevent negative repeat values
    const filledBars = Math.max(Math.floor(memPercent / 10), 0);
    const emptyBars = Math.max(10 - filledBars, 0);
    const memBar = "█".repeat(filledBars) + "░".repeat(emptyBars);
    
    // Calculate command speed in milliseconds
    const commandSpeed = `${speed}ms`;
    
    const infoLines = [];
    
    // ========== CROSS-DEVICE FRIENDLY FORMAT ==========
    // Keep formatting simple for all screen sizes
    if ((fieldsStatus && fieldsStatus.time) || (!fieldsStatus)) {
      infoLines.push(`> ┃ Date: ${currentDate}`);
      infoLines.push(`> ┃ Time: ${currentTime}`);
    }
    if ((fieldsStatus && fieldsStatus.user) || (!fieldsStatus)) infoLines.push(`> ┃ User: ${m.pushName || "Anonymous"}`);
    if ((fieldsStatus && fieldsStatus.owner) || (!fieldsStatus)) infoLines.push(`> ┃ Owner: ${ownerName}`);
    if ((fieldsStatus && fieldsStatus.mode) || (!fieldsStatus)) infoLines.push(`> ┃ Mode: ${botMode}`);
    if ((fieldsStatus && fieldsStatus.prefix) || (!fieldsStatus)) infoLines.push(`> ┃ Prefix: [ ${botPrefix} ]`);
    if ((fieldsStatus && fieldsStatus.version) || (!fieldsStatus)) infoLines.push(`> ┃ Version: ${botVersion}`);
    if ((fieldsStatus && fieldsStatus.host) || (!fieldsStatus)) {
      infoLines.push(`> ┃ Panel: ${deploymentPlatform.name}`);
      infoLines.push(`> ┃ Status: ${deploymentPlatform.status}`);
    }
    if ((fieldsStatus && fieldsStatus.speed) || (!fieldsStatus)) {
      infoLines.push(`> ┃ Speed: ${commandSpeed}`);
    }
    if ((fieldsStatus && fieldsStatus.uptime) || (!fieldsStatus)) infoLines.push(`> ┃ Uptime: ${uptimeStr}`);
    if ((fieldsStatus && fieldsStatus.usage) || (!fieldsStatus)) infoLines.push(`> ┃ Usage: ${usedMem} MB of ${totalMem} GB`);
    if ((fieldsStatus && fieldsStatus.ram) || (!fieldsStatus)) infoLines.push(`> ┃ RAM: ${memBar} ${memPercent}%`);

    if (infoLines.length > 0) {
      const infoCaption = `> ┌────────────────\n${infoLines.join('\n')}\n> └────────────────\n`;
      infoSection += infoCaption;
    }
  } else {
    // If no info fields are enabled, still show basic header
    infoSection += `> *No additional information is enabled.*\n> *Use .togglemenuinfo to customize*\n`;
  }

  const commandsText = `> ┌────────────────
> │ 🏠 *GROUP MANAGEMENT* 🏠 
> ├────────────────
> │ 🛡️ *ADMIN & MODERATION* 🛡️ 
> ├────────────────
> │ • add                     
> │ • promote                 
> │ • demote                  
> │ • kick                    
> │ • kickall                 
> │ • ban                     
> │ • unban                   
> │ • banlist                 
> │ • clearbanlist            
> │ • warn                    
> │ • resetwarn               
> │ • setwarn                 
> │ • mute                    
> │ • unmute                  
> │ • gctime                  
> │ • antileave               
> │ • antilink                
> │ • welcome                 
> ├────────────────
> │ 🚫 *AUTO-MODERATION* 🚫   
> ├────────────────
> │ • antisticker             
> │ • antiviewonce  
> │ • antilink  
> │ • antiimage
> │ • antivideo
> │ • antiaudio
> │ • antimention
> │ • antistatusmention  
> │ • antigrouplink
> ├────────────────
> │ 📊 *GROUP INFO & TOOLS* 📊 
> ├────────────────
> │ • groupinfo               
> │ • tagadmin                
> │ • tagall                  
> │ • hidetag                 
> │ • link                    
> │ • invite                  
> │ • revoke                  
> │ • setdesc                 
> │ • fangtrace               
> │ • getgpp                  
> └────────────────

> ┌────────────────
> │ 🎨 *MENU COMMANDS* 🎨
> ├────────────────
> │ • togglemenuinfo
> │ • setmenuimage
> │ • resetmenuinfo
> │ • menustyle
> └────────────────

> ┌────────────────
> │ 👑 *OWNER CONTROLS* 👑    
> ├────────────────
> │ ⚡ *CORE MANAGEMENT* ⚡    
> ├────────────────
> │ • setbotname              
> │ • setowner                
> │ • setprefix               
> │ • iamowner                
> │ • about                   
> │ • block                   
> │ • unblock                 
> │ • blockdetect             
> │ • silent                  
> │ • anticall                
> │ • mode                    
> │ • online                  
> │ • setpp                   
> │ • repo                    
> ├────────────────
> │ 🔄 *SYSTEM & MAINTENANCE* 🛠️ 
> ├────────────────
> │ • restart                 
> │ • workingreload           
> │ • reloadenv               
> │ • getsettings             
> │ • setsetting              
> │ • test                    
> │ • disk                    
> │ • hostip                  
> │ • findcommands            
> └────────────────

> ┌────────────────
> │ ⚙️ *AUTOMATION* ⚙️
> ├────────────────
> │ • autoread                
> │ • autotyping              
> │ • autorecording           
> │ • autoreact               
> │ • autoreactstatus         
> │ • autobio                 
> │ • autorec                 
> └────────────────

> ┌────────────────
> │ ✨ *GENERAL UTILITIES* ✨
> ├────────────────
> │ 🔍 *INFO & SEARCH* 🔎
> ├────────────────
> │ • alive
> │ • ping
> │ • ping2
> │ • time
> │ • connection
> │ • define
> │ • news
> │ • covid
> │ • iplookup
> │ • getip
> │ • getpp
> │ • getgpp
> │ • prefixinfo
> ├───────────────
> │ 🔗 *CONVERSION & MEDIA* 📁
> ├───────────────
> │ • shorturl
> │ • qrencode
> │ • take
> │ • imgbb
> │ • tiktok
> │ • save
> ├───────────────
> │ 📝 *PERSONAL TOOLS* 📅
> ├───────────────
> │ • pair
> │ • resetwarn
> │ • setwarn
> └────────────────

> ┌────────────────
> │ 🎵 *MUSIC & MEDIA* 🎶
> ├────────────────
> │ • play                    
> │ • song                    
> │ • lyrics                  
> │ • spotify                 
> │ • video                   
> │ • video2                  
> │ • bassboost               
> │ • trebleboost             
> └────────────────

> ┌───────────────
> │ 🤖 *MEDIA & AI COMMANDS* 🧠 
> ├───────────────
> │ ⬇️ *MEDIA DOWNLOADS* 📥     
> ├───────────────
> │ • youtube                 
> │ • tiktok                 
> │ • instagram               
> │ • facebook                
> │ • snapchat                
> │ • apk                     
> ├───────────────
> │ 🎨 *AI GENERATION* 💡    
> ├───────────────
> │ • gpt                     
> │ • gemini                  
> │ • deepseek                
> │ • deepseek+               
> │ • analyze                 
> │ • suno                    
> │ • wolfbot                 
> │ • videogen                
> └───────────────

> ┌───────────────
> │ 🖼️ *IMAGE TOOLS* 🖼️
> ├───────────────
> │ • image                   
> │ • imagegenerate           
> │ • anime                   
> │ • art                     
> │ • real                    
> └───────────────

> ┌───────────────
> │ 🛡️ *SECURITY & HACKING* 🔒 
> ├───────────────
> │ 🌐 *NETWORK & INFO* 📡   
> ├───────────────
> │ • ipinfo                  
> │ • shodan                  
> │ • iplookup                
> │ • getip                   
> └───────────────

> 🐺🌕*POWERED BY WOLF TECH*🌕🐺
`;
  
  // ========== APPLY "READ MORE" EFFECT ==========
  // Combine info section (visible) and commands (hidden) with "Read more"
  finalCaption = createReadMoreEffect(infoSection, commandsText);
  // ========== END "READ MORE" EFFECT ==========

  const imgPath1 = path.join(__dirname, "media", "wolfbot.jpg");
  const imgPath2 = path.join(__dirname, "../media/wolfbot.jpg");
  const imagePath = fs.existsSync(imgPath1) ? imgPath1 : fs.existsSync(imgPath2) ? imgPath2 : null;
  if (!imagePath) {
    await sock.sendMessage(jid, { text: "⚠️ Image 'wolfbot.jpg' not found!" }, { quoted: m });
    return;
  }
  const buffer = fs.readFileSync(imagePath);

  await sock.sendMessage(jid, { 
    image: buffer, 
    caption: finalCaption, 
    mimetype: "image/jpeg"
  }, { quoted: m });
  
  console.log(`✅ Cross-device menu sent with enhanced "Read more" effect`);
  break;
}





case 7: {
  // 🖼️ Full info + image + commands (with individual toggles)
  let finalCaption = "";
  
  // ========== IMPROVED HELPER FUNCTION ==========
  const createReadMoreEffect = (text1, text2) => {
    /**
     * Creates WhatsApp's "Read more" effect using invisible characters
     * @param {string} text1 - First part (visible before "Read more")
     * @param {string} text2 - Second part (hidden after "Read more")
     * @returns {string} Formatted text with "Read more" effect
     */
    
    // WhatsApp needs MORE invisible characters to trigger "Read more"
    // Use 500+ characters for better reliability
    const invisibleChars = [
      '\u200E',    // LEFT-TO-RIGHT MARK
      '\u200F',    // RIGHT-TO-LEFT MARK
      '\u200B',    // ZERO WIDTH SPACE
      '\u200C',    // ZERO WIDTH NON-JOINER
      '\u200D',    // ZERO WIDTH JOINER
      '\u2060',    // WORD JOINER
      '\uFEFF',    // ZERO WIDTH NO-BREAK SPACE
    ];
    
    // Create a LONG string of invisible characters (500-600 chars)
    // WhatsApp needs enough to break the line detection
    const invisibleString = Array.from({ length: 550 }, 
      (_, i) => invisibleChars[i % invisibleChars.length]
    ).join('');
    
    // Add a newline after invisible characters for cleaner break
    return `${text1}${invisibleString}\n${text2}`;
  };
  // ========== END OF HELPER FUNCTION ==========
  
  // Add these helper functions at the start of case 7
  const getBotMode = () => {
    try {
      const possiblePaths = [
        './bot_mode.json',
        path.join(__dirname, 'bot_mode.json'),
        path.join(__dirname, '../bot_mode.json'),
        path.join(__dirname, '../../bot_mode.json'),
        path.join(__dirname, '../../../bot_mode.json'),
        path.join(__dirname, '../commands/owner/bot_mode.json'),
      ];
      
      for (const modePath of possiblePaths) {
        if (fs.existsSync(modePath)) {
          try {
            const modeData = JSON.parse(fs.readFileSync(modePath, 'utf8'));
            
            if (modeData.mode) {
              let displayMode;
              switch(modeData.mode.toLowerCase()) {
                case 'public':
                  displayMode = '🌍 Public';
                  break;
                case 'silent':
                  displayMode = '🔇 Silent';
                  break;
                case 'private':
                  displayMode = '🔒 Private';
                  break;
                case 'group-only':
                  displayMode = '👥 Group Only';
                  break;
                case 'maintenance':
                  displayMode = '🛠️ Maintenance';
                  break;
                default:
                  displayMode = `⚙️ ${modeData.mode.charAt(0).toUpperCase() + modeData.mode.slice(1)}`;
              }
              return displayMode;
            }
          } catch (parseError) {}
        }
      }
      
      // Fallback to global variables
      if (global.BOT_MODE) {
        return global.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (global.mode) {
        return global.mode === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      if (process.env.BOT_MODE) {
        return process.env.BOT_MODE === 'silent' ? '🔇 Silent' : '🌍 Public';
      }
      
    } catch (error) {}
    
    return '🌍 Public';
  };
  
  const getBotName = () => {
    try {
      const possiblePaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
        path.join(__dirname, '../../../bot_settings.json'),
        path.join(__dirname, '../commands/owner/bot_settings.json'),
      ];
      
      for (const settingsPath of possiblePaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.botName && settings.botName.trim() !== '') {
              return settings.botName.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.BOT_NAME) {
        return global.BOT_NAME;
      }
      
      if (process.env.BOT_NAME) {
        return process.env.BOT_NAME;
      }
      
    } catch (error) {}
    
    return 'WOLFBOT';
  };
  
  const getOwnerName = () => {
    try {
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.ownerName && settings.ownerName.trim() !== '') {
              return settings.ownerName.trim();
            }
          } catch (parseError) {}
        }
      }
      
      const ownerPath = path.join(__dirname, 'owner.json');
      if (fs.existsSync(ownerPath)) {
        const ownerData = fs.readFileSync(ownerPath, 'utf8');
        const ownerInfo = JSON.parse(ownerData);
        
        if (ownerInfo.owner && ownerInfo.owner.trim() !== '') {
          return ownerInfo.owner.trim();
        } else if (ownerInfo.number && ownerInfo.number.trim() !== '') {
          return ownerInfo.number.trim();
        } else if (ownerInfo.phone && ownerInfo.phone.trim() !== '') {
          return ownerInfo.phone.trim();
        } else if (ownerInfo.contact && ownerInfo.contact.trim() !== '') {
          return ownerInfo.contact.trim();
        } else if (Array.isArray(ownerInfo) && ownerInfo.length > 0) {
          const owner = typeof ownerInfo[0] === 'string' ? ownerInfo[0] : "Unknown";
          return owner;
        }
      }
      
      if (global.OWNER_NAME) {
        return global.OWNER_NAME;
      }
      if (global.owner) {
        return global.owner;
      }
      if (process.env.OWNER_NUMBER) {
        return process.env.OWNER_NUMBER;
      }
      
    } catch (error) {}
    
    return 'Unknown';
  };
  
  const getBotPrefix = () => {
    try {
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
        path.join(__dirname, '../../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.prefix && settings.prefix.trim() !== '') {
              return settings.prefix.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.prefix) {
        return global.prefix;
      }
      
      if (process.env.PREFIX) {
        return process.env.PREFIX;
      }
      
    } catch (error) {}
    
    return '.';
  };
  
  const getBotVersion = () => {
    try {
      const ownerPath = path.join(__dirname, 'owner.json');
      if (fs.existsSync(ownerPath)) {
        const ownerData = fs.readFileSync(ownerPath, 'utf8');
        const ownerInfo = JSON.parse(ownerData);
        
        if (ownerInfo.version && ownerInfo.version.trim() !== '') {
          return ownerInfo.version.trim();
        }
      }
      
      const botSettingsPaths = [
        './bot_settings.json',
        path.join(__dirname, 'bot_settings.json'),
        path.join(__dirname, '../bot_settings.json'),
      ];
      
      for (const settingsPath of botSettingsPaths) {
        if (fs.existsSync(settingsPath)) {
          try {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            if (settings.version && settings.version.trim() !== '') {
              return settings.version.trim();
            }
          } catch (parseError) {}
        }
      }
      
      if (global.VERSION) {
        return global.VERSION;
      }
      
      if (global.version) {
        return global.version;
      }
      
      if (process.env.VERSION) {
        return process.env.VERSION;
      }
      
    } catch (error) {}
    
    return 'v1.0.0';
  };
  
  const getDeploymentPlatform = () => {
    // Detect deployment platform
    if (process.env.REPL_ID || process.env.REPLIT_DB_URL) {
      return {
        name: 'Replit',
        status: 'Active',
        icon: '🌀'
      };
    } else if (process.env.HEROKU_APP_NAME) {
      return {
        name: 'Heroku',
        status: 'Active',
        icon: '🦸'
      };
    } else if (process.env.RENDER_SERVICE_ID) {
      return {
        name: 'Render',
        status: 'Active',
        icon: '⚡'
      };
    } else if (process.env.RAILWAY_ENVIRONMENT) {
      return {
        name: 'Railway',
        status: 'Active',
        icon: '🚂'
      };
    } else if (process.env.VERCEL) {
      return {
        name: 'Vercel',
        status: 'Active',
        icon: '▲'
      };
    } else if (process.env.GLITCH_PROJECT_REMIX) {
      return {
        name: 'Glitch',
        status: 'Active',
        icon: '🎏'
      };
    } else if (process.env.KOYEB) {
      return {
        name: 'Koyeb',
        status: 'Active',
        icon: '☁️'
      };
    } else if (process.env.CYCLIC_URL) {
      return {
        name: 'Cyclic',
        status: 'Active',
        icon: '🔄'
      };
    } else if (process.env.PANEL) {
      return {
        name: 'PteroPanel',
        status: 'Active',
        icon: '🖥️'
      };
    } else if (process.env.SSH_CONNECTION || process.env.SSH_CLIENT) {
      return {
        name: 'VPS/SSH',
        status: 'Active',
        icon: '🖥️'
      };
    } else if (process.platform === 'win32') {
      return {
        name: 'Windows PC',
        status: 'Active',
        icon: '💻'
      };
    } else if (process.platform === 'linux') {
      return {
        name: 'Linux VPS',
        status: 'Active',
        icon: '🐧'
      };
    } else if (process.platform === 'darwin') {
      return {
        name: 'MacOS',
        status: 'Active',
        icon: '🍎'
      };
    } else {
      return {
        name: 'Local Machine',
        status: 'Active',
        icon: '🏠'
      };
    }
  };
  
  // Get current time and date
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Load bot information using helper functions
  const botName = getBotName();
  const ownerName = getOwnerName();
  const botPrefix = getBotPrefix();
  const botVersion = getBotVersion();
  const botMode = getBotMode();
  const deploymentPlatform = getDeploymentPlatform();
  
  // Add bot name header before the info section
  let infoSection = `┌────────────────
│ 🐺 *${botName} MENU* 🐺
└────────────────\n\n`;
  
  // Add info section only if any field is enabled
  const fieldsStatus = getAllFieldsStatus(style);
  
  // ========== FIX: Add safety check for fieldsStatus ==========
  let hasInfoFields = false;
  if (fieldsStatus && typeof fieldsStatus === 'object') {
    hasInfoFields = Object.values(fieldsStatus).some(val => val);
  } else {
    // If getAllFieldsStatus doesn't exist or returns invalid, show all info
    hasInfoFields = true;
  }
  
  if (hasInfoFields) {
    const start = performance.now();
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const mnt = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${h}h ${mnt}m ${s}s`;
    const speed = (performance.now() - start).toFixed(2);
    const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(0);
    
    // SAFE CALCULATION: Prevent negative or invalid percentages
    const memPercentNum = ((usedMem / (totalMem * 1024)) * 100);
    const memPercent = Math.min(Math.max(parseFloat(memPercentNum.toFixed(0)), 0), 100);
    
    // SAFE BAR CALCULATION: Prevent negative repeat values
    const filledBars = Math.max(Math.floor(memPercent / 10), 0);
    const emptyBars = Math.max(10 - filledBars, 0);
    const memBar = "█".repeat(filledBars) + "░".repeat(emptyBars);
    
    // Calculate command speed in milliseconds
    const commandSpeed = `${speed}ms`;
    
    // Get CPU load (keeping for internal calculation but not displaying)
    const cpuLoad = Math.min(parseFloat(os.loadavg()[0].toFixed(2)), 5);
    const cpuLoadBars = Math.max(Math.floor(cpuLoad), 0);
    const cpuLoadEmpty = Math.max(5 - cpuLoadBars, 0);
    const cpuLoadBar = "█".repeat(cpuLoadBars) + "░".repeat(cpuLoadEmpty);
    
    const infoLines = [];
    
    // ========== FIX: Check each field individually ==========
    if ((fieldsStatus && fieldsStatus.time) || (!fieldsStatus)) infoLines.push(`*┃ Date: ${currentDate}*`);
    if ((fieldsStatus && fieldsStatus.time) || (!fieldsStatus)) infoLines.push(`*┃ Time: ${currentTime}*`);
    if ((fieldsStatus && fieldsStatus.user) || (!fieldsStatus)) infoLines.push(`*┃ User: ${m.pushName || "Anonymous"}*`);
    if ((fieldsStatus && fieldsStatus.owner) || (!fieldsStatus)) infoLines.push(`*┃ Owner: ${ownerName}*`);
    if ((fieldsStatus && fieldsStatus.mode) || (!fieldsStatus)) infoLines.push(`*┃ Mode: ${botMode}*`);
    if ((fieldsStatus && fieldsStatus.prefix) || (!fieldsStatus)) infoLines.push(`*┃ Prefix: [ ${botPrefix} ]*`);
    if ((fieldsStatus && fieldsStatus.version) || (!fieldsStatus)) infoLines.push(`*┃ Version: ${botVersion}*`);
    if ((fieldsStatus && fieldsStatus.host) || (!fieldsStatus)) {
      infoLines.push(`*┃ Panel: ${deploymentPlatform.name}*`);
      infoLines.push(`*┃ Status: ${deploymentPlatform.status}*`);
    }
    if ((fieldsStatus && fieldsStatus.speed) || (!fieldsStatus)) {
      infoLines.push(`*┃ Speed: ${commandSpeed}*`);
    }
    if ((fieldsStatus && fieldsStatus.uptime) || (!fieldsStatus)) infoLines.push(`*┃ Uptime: ${uptimeStr}*`);
    if ((fieldsStatus && fieldsStatus.usage) || (!fieldsStatus)) infoLines.push(`*┃ Usage: ${usedMem} MB of ${totalMem} GB*`);
    if ((fieldsStatus && fieldsStatus.ram) || (!fieldsStatus)) infoLines.push(`*┃ RAM: ${memBar} ${memPercent}%*`);

    if (infoLines.length > 0) {
      const infoCaption = `┌────────────────\n${infoLines.join('\n')}\n└────────────────\n\n`;
      infoSection += infoCaption;
    }
  } else {
    // If no info fields are enabled, still show basic header
    infoSection += `*No additional information is enabled.*\n*Use .togglemenuinfo to customize*\n\n`;
  }

  const commandsText = `┌────────────────
│ 🏠 GROUP MANAGEMENT 🏠 
├────────────────
│ 🛡️ ADMIN & MODERATION 🛡️ 
├────────────────
│ add                     
│ promote                 
│ demote                  
│ kick                    
│ kickall                 
│ ban                     
│ unban                   
│ banlist                 
│ clearbanlist            
│ warn                    
│ resetwarn               
│ setwarn                 
│ mute                    
│ unmute                  
│ gctime                  
│ antileave               
│ antilink                
│ welcome                 
├────────────────
│ 🚫 AUTO-MODERATION 🚫   
├────────────────
│ antisticker             
│ antiviewonce  
│ antilink  
│ antiimage
│ antivideo
│ antiaudio
│ antimention
│ antistatusmention  
│ antigrouplink
├────────────────
│ 📊 GROUP INFO & TOOLS 📊 
├────────────────
│ groupinfo               
│ tagadmin                
│ tagall                  
│ hidetag                 
│ link                    
│ invite                  
│ revoke                 
│ setdesc                 
│ fangtrace               
│ getgpp 
│ togstatus                 
└────────────────

┌────────────────
│ 🎨 MENU COMMANDS 🎨
├────────────────
│ togglemenuinfo
│ setmenuimage
│ resetmenuinfo
│ menustyle
└────────────────

┌────────────────
│ 👑 OWNER CONTROLS 👑    
├────────────────
│ ⚡ CORE MANAGEMENT ⚡    
├────────────────
│ setbotname              
│ setowner                
│ setprefix               
│ iamowner                
│ about                   
│ block                   
│ unblock                 
│ blockdetect             
│ silent                  
│ anticall                
│ mode                    
│ online                  
│ setpp                   
│ repo                    
│ antidelete              
│ antideletestatus                  
├────────────────
│ 🔄 SYSTEM & MAINTENANCE 🛠️ 
├────────────────
│ restart                 
│ workingreload           
│ reloadenv               
│ getsettings             
│ setsetting              
│ test                    
│ disk                    
│ hostip                  
│ findcommands            
└────────────────

┌────────────────
│ ⚙️ AUTOMATION ⚙️
├────────────────
│ autoread                
│ autotyping              
│ autorecording           
│ autoreact               
│ autoreactstatus         
│ autobio                 
│ autorec                 
└────────────────
┌────────────────
│ ✨ GENERAL UTILITIES ✨
├────────────────
│ 🔍 INFO & SEARCH 🔎
├────────────────
│ alive
│ ping
│ ping2
│ time
│ connection
│ define
│ news
│ covid
│ iplookup
│ getip
│ getpp
│ getgpp
│ prefixinfo
├───────────────
│ 🔗 CONVERSION & MEDIA 📁
├───────────────
│ shorturl
│ qrencode
│ take
│ imgbb
│ tiktok
│ save
│ toimage
│ tosticker
│ toaudio
│ tts
├───────────────
│ 📝 PERSONAL TOOLS 📅
├───────────────
│ pair
│ resetwarn
│ setwarn
└────────────────


├────────────────
│ 🎵 MUSIC  🎶
├────────────────
│ play                    
│ song                    
│ lyrics                  
│ spotify                             
└────────────────

┌───────────────
│ 🤖 MEDIA & AI COMMANDS 🧠 
├───────────────
│ ⬇️ MEDIA DOWNLOADS 📥     
├───────────────
│ youtube                 
│ tiktok                 
│ instagram               
│ facebook                
│ snapchat                
│ apk   
│ yts
│ ytplay
│ ytmp3
│ ytv
│ ytmp4
│ ytplaydoc                  
├───────────────
│ 🎨 AI GENERATION 💡    
├───────────────
│ gpt                     
│ gemini                  
│ deepseek                
│ deepseek+               
│ analyze                 
│ suno                    
│ wolfbot                 
│ videogen                
└───────────────

┌───────────────
│ 🖼️ IMAGE TOOLS 🖼️
├───────────────
│ image                   
│ imagegenerate           
│ anime                   
│ art                     
│ real                    
└───────────────

┌───────────────
│ 🛡️ SECURITY & HACKING 🔒 
├───────────────
│ 🌐 NETWORK & INFO 📡   
├───────────────
│ ipinfo                  
│ shodan                  
│ iplookup                
│ getip                   
└───────────────

┌────────────────
│ 🎨 LOGO DESIGN STUDIO 🎨
├────────────────
│ 🌟 PREMIUM METALS 🌟    
├────────────────
│ goldlogo                
│ silverlogo              
│ platinumlogo            
│ chromelogo              
│ diamondlogo             
│ bronzelogo              
│ steelogo                
│ copperlogo              
│ titaniumlogo            
├────────────────
│ 🔥 ELEMENTAL EFFECTS 🔥  
├────────────────
│ firelogo                
│ icelogo                 
│ iceglowlogo             
│ lightninglogo           
│ aqualogo                
│ rainbowlogo             
│ sunlogo                 
│ moonlogo                
├────────────────
│ 🎭 MYTHICAL & MAGICAL 🧙  
├────────────────
│ dragonlogo              
│ phoenixlogo             
│ wizardlogo              
│ crystallogo             
│ darkmagiclogo           
├────────────────
│ 🌌 DARK & GOTHIC 🌑     
├────────────────
│ shadowlogo              
│ smokelogo               
│ bloodlogo               
├────────────────
│ 💫 GLOW & NEON EFFECTS 🌈  
├────────────────
│ neonlogo                
│ glowlogo                
├────────────────
│ 🤖 TECH & FUTURISTIC 🚀  
├────────────────
│ matrixlogo              
└────────────────
┌────────────────
│ 🐙 GITHUB COMMANDS 🐙
├────────────────
│ gitclone
│ gitinfo
│ repo
│ commits
│ stars
│ watchers
│ release
└────────────────
┌────────────────
│ 🌸 ANIME COMMANDS 🌸
├────────────────
│ awoo
│ bj
│ bully
│ cringe
│ cry
│ cuddle
│ dance
│ glomp
│ highfive
│ kill
│ kiss
│ lick
│ megumin
│ neko
│ pat
│ shinobu
│ trap
│ trap2
│ waifu
│ wink
│ yeet
└────────────────



🐺POWERED BY WOLFTECH🐺

`;

  // ========== APPLY "READ MORE" EFFECT ==========
  // Combine info section (visible) and commands (hidden) with "Read more"
  finalCaption = createReadMoreEffect(infoSection, commandsText);
  // ========== END "READ MORE" EFFECT ==========

  const imgPath1 = path.join(__dirname, "media", "wolfbot.jpg");
  const imgPath2 = path.join(__dirname, "../media/wolfbot.jpg");
  const imagePath = fs.existsSync(imgPath1) ? imgPath1 : fs.existsSync(imgPath2) ? imgPath2 : null;
  if (!imagePath) {
    await sock.sendMessage(jid, { text: "⚠️ Image 'wolfbot.jpg' not found!" }, { quoted: m });
    return;
  }
  const buffer = fs.readFileSync(imagePath);

  await sock.sendMessage(jid, { 
    image: buffer, 
    caption: finalCaption, 
    mimetype: "image/jpeg"
  }, { quoted: m });
  
  console.log(`✅ Menu sent with "Read more" effect`);
  break;
}














       

        
   
      }

      console.log("✅ Menu sent successfully");

    } catch (err) {
      console.error("❌ [MENU] ERROR:", err);
      await sock.sendMessage(jid, { text: "⚠ Failed to load menu." }, { quoted: m });
    }
  },
};
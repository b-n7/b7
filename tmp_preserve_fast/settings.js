// export default {
//     ownerNumber: '254703397679',
//     storeWriteInterval: 10000,
//       updateZipUrl: "https://github.com/777Wolf-dot/wolf-bot/archive/refs/heads/main.zip"
// }; 




// settings.js - WolfBot Configuration
export default {
  // ===== UPDATE CONFIGURATION =====
  update: {
    autoCheck: false, // Check for updates on startup (set to false for manual)
    checkInterval: 6, // Check every 6 hours (if autoCheck is true)
    autoDownload: false, // Auto-download updates
    backupBeforeUpdate: true, // Backup before applying updates
    method: "git", // Default method: "git" or "zip"
    
    // Repository URLs - UPDATED
    repository: {
      // Your main repository (your current bot)
      main: "https://github.com/Silent-Wolf7/Silentwolf.git",
      
      // Remote repository (where updates come from)
      upstream: "https://github.com/b-n7/b7.git",
      
      // Backup owner repository (if needed)
      owner: "https://github.com/Silent-Wolf7/Silentwolf.git"
    },
    
    // ZIP update URL (fallback method)
    zipUrl: "https://github.com/b-n7/b7/archive/refs/heads/main.zip",
    
    // Timeout settings (in milliseconds)
    timeouts: {
      download: 120000,     // 2 minutes for download
      extraction: 180000,   // 3 minutes for extraction
      copy: 300000,        // 5 minutes for file copy
      preserve: 30000      // 30 seconds for file preservation
    },
    
    // Update behavior
    behavior: {
      preserveSession: true,     // Keep session files
      preserveConfig: true,      // Keep config files
      preserveData: true,        // Keep data files
      skipNodeModules: true,     // Skip node_modules to save time
      installDeps: true,         // Run npm install after update
      restartAfterUpdate: true   // Restart bot after successful update
    }
  },
  
  // ... rest of your configuration
}

//I am Silent Wolf yeap that is my name
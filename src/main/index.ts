import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Client, SetActivity } from '@xhayper/discord-rpc'
import { ActivityType } from 'discord-api-types/v10'
import fs from 'fs'

// Discord RPC setup
const clientId = '1294367228212547658'
let rpc = new Client({ clientId })
let isLoggedIn = false

// Define the path to your config file
const configPath = join(app.getPath('appData'), 'vibe', 'config.json')

// Ensure the config directory and file exist
function ensureConfigFile() {
  const configDir = join(app.getPath('appData'), 'vibe')

  // Create the directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }

  // Create a default config file if it doesn't exist
  if (!fs.existsSync(configPath)) {
    const defaultConfig = { userURL: '' } // You can add more default values here
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    console.log(`Created config file at ${configPath}`)
  } else {
    console.log(`Config file already exists at ${configPath}`)
  }
}

// Load configuration from the config file
function loadConfig() {
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(configData)
  } else {
    console.warn(`Config file not found. Using default configuration.`)
    return { userURL: '' } // Return default values here if needed
  }
}

// Update configuration file with the new URL
function updateConfigURL(url) {
  const config = loadConfig()
  config.userURL = url // Update the URL
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  console.log(`Updated user URL in config file: ${url}`)
}

// Initialize configuration
ensureConfigFile()
const config = loadConfig() // Load the config

// Function to set Discord activity
async function setDiscordActivity(songInfo) {
  // Check if all required song info is present
  const { title, artist, duration, imgSrc, url, progress } = songInfo
  if (!title || !artist || !duration || !imgSrc) {
    console.warn('Not all song info is available, skipping Discord activity update')
    return // Exit early if any required info is missing
  }

  if (!isLoggedIn) {
    try {
      await rpc.login()
      isLoggedIn = true // Update login status
      console.log('Connected to Discord')
    } catch (error) {
      console.error('Failed to log into Discord:', error)
      setTimeout(() => setDiscordActivity(songInfo), 5000) // Retry every 5 seconds
      return
    }
  }

  // Calculate timestamps
  const durationMs = parseDuration(duration) // Total duration in milliseconds
  const currentProgressMs = parseDuration(progress) // Current progress in milliseconds
  const startTimestamp = Math.floor(Date.now() / 1000) - currentProgressMs / 1000 // Current time minus elapsed time
  const endTimestamp = startTimestamp + durationMs / 1000 // Duration in seconds added to start time

  const activity: SetActivity = {
    type: ActivityType.Listening,
    details: title,
    state: `by ${artist}`,
    largeImageKey: imgSrc,
    largeImageText: `getvibe.in`,
    startTimestamp,
    endTimestamp,
    buttons: [
      {
        label: 'Listen Together',
        url: url+"&utm_source=discord&utm_medium=display&utm_campaign=discord_activity"
      }
    ]
  }

  try {
    await rpc?.user?.setActivity(activity)
    console.log('Discord activity set:', activity)
  } catch (error) {
    console.error('Failed to set Discord activity:', error)
  }
}

// Helper function to convert duration to milliseconds
function parseDuration(duration) {
  const parts = duration.split(':')
  const minutes = parseInt(parts[0], 10)
  const seconds = parseInt(parts[1], 10)
  return (minutes * 60 + seconds) * 1000 // Convert to milliseconds
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 770,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const startUrl = config.userURL || 'https://getvibe.in' // Use the URL from config or default

  if (is.dev) {
    mainWindow.loadURL(startUrl) // Load the URL from config
  } else {
    mainWindow.loadURL(startUrl) // Load the URL from con
  }

  mainWindow.webContents.on('did-finish-load', async () => {
    const observersSetup = `
      const { ipcRenderer } = require('electron');
      
      // Function to send song information as a single object
      const sendSongInfo = (songInfo) => {
        ipcRenderer.send('song-info-updated', songInfo);
      };
      
      // Object to hold the song information
      const songInfo = {
        title: '',
        artist: '',
        progress: '',
        duration: '',
        imgSrc: '',
        url: window.location.href
      };
      
      // Function to update song information and send it
      const updateSongInfo = () => {
        // Get the cover image source based on the title
        const coverImage = document.querySelector('img[alt="' + songInfo.title + '"]');
        songInfo.imgSrc = coverImage ? coverImage.src : ''; // Update imgSrc with the image URL
      
        sendSongInfo(songInfo); // Send updated song info
      };
      
      const setupObserver = (selector, eventName, key) => {
        const element = document.querySelector(selector);
        if (element) {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const newText = element.textContent;
                songInfo[key] = newText; // Update the corresponding field in songInfo
                updateSongInfo(); // Send updated song info
              }
            });
          });
      
          observer.observe(element, {
            characterData: true,
            childList: true,
            subtree: true
          });
        } else {
          console.warn(\`\${selector} element not found\`);
        }
      };
      
      setupObserver('.artist', 'artist-text-changed', 'artist');
      setupObserver('.title', 'title-text-changed', 'title');
      setupObserver('.progress', 'progress-changed', 'progress');
      setupObserver('.duration', 'duration-changed', 'duration');
      
      // Call updateSongInfo initially to get the cover image when the script loads
      const initialTitle = document.querySelector('.title') ? document.querySelector('.title').textContent : '';
      if (initialTitle) {
        songInfo.title = initialTitle;
        updateSongInfo();
      }
    `

    mainWindow.webContents.executeJavaScript(observersSetup).catch((error) => {
      console.error('Error setting up MutationObservers:', error)
    })
  })

  // Listen for URL changes
  mainWindow.webContents.on('did-navigate', (_event, newUrl) => {
    console.log(`Navigated to: ${newUrl}`)
    if (!newUrl.startsWith("https://getvibe")) return;
    updateConfigURL(newUrl) // Update the config file with the new URL
    
  })
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('song-info-updated', async (_event, songInfo) => {
    await setDiscordActivity(songInfo)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

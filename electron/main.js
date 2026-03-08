const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn, exec } = require('child_process')

let zapretProcess = null
let cmdWindow = null

const configMap = {
  'general': 'general.bat',
  'general-alt': 'general (ALT).bat',
  'general-alt2': 'general (ALT2).bat',
  'general-alt3': 'general (ALT3).bat',
  'general-alt4': 'general (ALT4).bat',
  'general-alt5': 'general (ALT5).bat',
  'general-alt6': 'general (ALT6).bat',
  'general-alt7': 'general (ALT7).bat',
  'general-alt8': 'general (ALT8).bat',
  'general-alt9': 'general (ALT9).bat',
  'general-alt10': 'general (ALT10).bat',
  'general-alt11': 'general (ALT11).bat',
  'fake-tls': 'general (FAKE TLS AUTO).bat',
  'fake-tls-alt': 'general (FAKE TLS AUTO ALT).bat',
  'fake-tls-alt2': 'general (FAKE TLS AUTO ALT2).bat',
  'fake-tls-alt3': 'general (FAKE TLS AUTO ALT3).bat',
  'simple-fake': 'general (SIMPLE FAKE).bat',
  'simple-fake-alt': 'general (SIMPLE FAKE ALT).bat',
  'simple-fake-alt2': 'general (SIMPLE FAKE ALT2).bat'
}

ipcMain.handle('start-zapret', async (event, config) => {
  if (zapretProcess) {
    return { success: false, message: 'Already running' }
  }

  const batFile = configMap[config]
  const zapretPath = path.join(process.resourcesPath, 'zapret-discord-youtube', batFile)

  try {
    const isDev = !app.isPackaged
    const zapretDir = isDev 
      ? path.join(__dirname, '../../zapret-discord-youtube')
      : path.join(process.resourcesPath, 'zapret-discord-youtube')
    
    zapretProcess = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', `"${zapretPath}"`], {
      cwd: zapretDir,
      detached: true,
      shell: true
    })

    zapretProcess.unref()

    setTimeout(() => {
      zapretProcess = { active: true }
    }, 2000)

    return { success: true, message: 'Started' }
  } catch (error) {
    zapretProcess = null
    return { success: false, message: error.message }
  }
})

ipcMain.handle('stop-zapret', async () => {
  return new Promise((resolve) => {
    exec('taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq *zapret*"', (error) => {
      exec('taskkill /F /IM winws.exe', (error2) => {
        zapretProcess = null
        cmdWindow = null
        resolve({ success: true, message: 'Stopped' })
      })
    })
  })
})

ipcMain.handle('get-status', async () => {
  return { running: zapretProcess !== null }
})

ipcMain.handle('close-app', async () => {
  return new Promise((resolve) => {
    exec('taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq *zapret*"', (error) => {
      exec('taskkill /F /IM winws.exe', (error2) => {
        zapretProcess = null
        cmdWindow = null
        app.quit()
        resolve()
      })
    })
  })
})

ipcMain.handle('minimize-app', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.minimize()
})

ipcMain.handle('maximize-app', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win.isMaximized()) {
    win.unmaximize()
  } else {
    win.maximize()
  }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    resizable: false,
    frame: false,
    backgroundColor: '#000000'
  })

  win.loadURL('http://localhost:5174')
  
  win.on('close', (e) => {
    e.preventDefault()
    exec('taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq *zapret*"', (error) => {
      exec('taskkill /F /IM winws.exe', (error2) => {
        zapretProcess = null
        cmdWindow = null
        win.destroy()
        app.quit()
      })
    })
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  exec('taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq *zapret*"', (error) => {
    exec('taskkill /F /IM winws.exe', (error2) => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  })
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

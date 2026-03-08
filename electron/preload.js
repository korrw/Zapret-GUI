const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  startZapret: (config) => ipcRenderer.invoke('start-zapret', config),
  stopZapret: () => ipcRenderer.invoke('stop-zapret'),
  getStatus: () => ipcRenderer.invoke('get-status'),
  closeApp: () => ipcRenderer.invoke('close-app'),
  minimizeApp: () => ipcRenderer.invoke('minimize-app'),
  maximizeApp: () => ipcRenderer.invoke('maximize-app')
})

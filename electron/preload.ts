import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanDevices: () => ipcRenderer.invoke('scan-devices'),
  sendFile: (filePath: string, deviceId: string) => ipcRenderer.invoke('send-file', { filePath, deviceId }),
  startReceive: (savePath?: string) => ipcRenderer.invoke('start-receive', savePath),
})

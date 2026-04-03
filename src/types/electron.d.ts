export interface ElectronAPI {
  selectFile: () => Promise<string>
  selectFolder: () => Promise<string>
  scanDevices: () => Promise<Array<{ id: string; name: string }>>
  sendFile: (filePath: string, deviceId: string) => Promise<{ success: boolean; output: string }>
  startReceive: (savePath?: string) => Promise<{ success: boolean; output: string }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}

import { create } from 'zustand'

export interface FileInfo {
  name: string
  path: string
  size: number
  type: string
}

export interface Device {
  id: string
  name: string
  ip: string
  status: 'online' | 'offline'
}

export interface LogEntry {
  id: number
  timestamp: Date
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export type TransferStatus = 
  | 'idle'
  | 'scanning'
  | 'compressing'
  | 'sending'
  | 'receiving'
  | 'decompressing'
  | 'completed'
  | 'error'

export interface TransferProgress {
  bytesTransferred: number
  totalBytes: number
  speed: number
  status: TransferStatus
  message: string
}

interface AppState {
  mode: 'send' | 'receive'
  selectedFile: FileInfo | null
  savePath: string
  devices: Device[]
  selectedDevice: Device | null
  isScanning: boolean
  isTransferring: boolean
  progress: TransferProgress
  logs: LogEntry[]
  logId: number

  setMode: (mode: 'send' | 'receive') => void
  setSelectedFile: (file: FileInfo | null) => void
  setSavePath: (path: string) => void
  setDevices: (devices: Device[]) => void
  setSelectedDevice: (device: Device | null) => void
  setIsScanning: (scanning: boolean) => void
  setIsTransferring: (transferring: boolean) => void
  setProgress: (progress: Partial<TransferProgress>) => void
  addLog: (message: string, type: LogEntry['type']) => void
  clearLogs: () => void
  resetTransfer: () => void
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'send',
  selectedFile: null,
  savePath: '',
  devices: [],
  selectedDevice: null,
  isScanning: false,
  isTransferring: false,
  progress: {
    bytesTransferred: 0,
    totalBytes: 0,
    speed: 0,
    status: 'idle',
    message: '',
  },
  logs: [],
  logId: 0,

  setMode: (mode) => set({ mode }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setSavePath: (savePath) => set({ savePath }),
  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (selectedDevice) => set({ selectedDevice }),
  setIsScanning: (isScanning) => set({ isScanning }),
  setIsTransferring: (isTransferring) => set({ isTransferring }),
  setProgress: (progress) => set((state) => ({ 
    progress: { ...state.progress, ...progress } 
  })),
  addLog: (message, type) => set((state) => ({ 
    logs: [...state.logs, { id: state.logId + 1, timestamp: new Date(), message, type }],
    logId: state.logId + 1 
  })),
  clearLogs: () => set({ logs: [] }),
  resetTransfer: () => set({ 
    progress: { bytesTransferred: 0, totalBytes: 0, speed: 0, status: 'idle', message: '' },
    isTransferring: false 
  }),
}))

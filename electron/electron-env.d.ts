/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  electronAPI: {
    selectFile: () => Promise<string | null>
    selectFolder: () => Promise<string | null>
    scanDevices: () => Promise<{ name: string; id: string }[]>
    sendFile: (filePath: string, deviceId: string) => Promise<{ success: boolean; output: string }>
    startReceive: (savePath?: string) => Promise<{ success: boolean; output: string }>
  }
}

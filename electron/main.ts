import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(win!, {
    properties: ['openFile']
  })
  return result.filePaths[0] || null
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(win!, {
    properties: ['openDirectory']
  })
  return result.filePaths[0] || null
})

ipcMain.handle('scan-devices', async () => {
  return new Promise((resolve) => {
    const child = spawn('Transfer-Engine.exe', ['Send'], {
      cwd: process.env.APP_ROOT,
      shell: true
    })
    let output = ''
    child.stdout.on('data', (data) => {
      output += data.toString()
    })
    child.on('close', () => {
      const devices = output.split('\n')
        .filter(line => line.trim())
        .map(line => ({ name: line.trim(), id: line.trim() }))
      resolve(devices)
    })
    child.on('error', () => resolve([]))
  })
})

ipcMain.handle('send-file', async (_event, { filePath }: { filePath: string; deviceId: string }) => {
  return new Promise((resolve) => {
    const child = spawn('Transfer-Engine.exe', ['Send', filePath], {
      cwd: process.env.APP_ROOT,
      shell: true
    })
    let output = ''
    child.stdout.on('data', (data) => { output += data.toString() })
    child.on('close', (code) => resolve({ success: code === 0, output }))
    child.on('error', (err) => resolve({ success: false, output: err.message }))
  })
})

ipcMain.handle('start-receive', async (_, savePath?: string) => {
  return new Promise((resolve) => {
    const args = savePath ? ['Receive', savePath] : ['Receive']
    const child = spawn('Transfer-Engine.exe', args, {
      cwd: process.env.APP_ROOT,
      shell: true
    })
    let output = ''
    child.stdout.on('data', (data) => { output += data.toString() })
    child.on('close', (code) => resolve({ success: code === 0, output }))
    child.on('error', (err) => resolve({ success: false, output: err.message }))
  })
})

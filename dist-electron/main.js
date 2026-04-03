import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openFile"]
  });
  return result.filePaths[0] || null;
});
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"]
  });
  return result.filePaths[0] || null;
});
ipcMain.handle("scan-devices", async () => {
  return new Promise((resolve) => {
    const child = spawn("Transfer-Engine.exe", ["Send"], {
      cwd: process.env.APP_ROOT,
      shell: true
    });
    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.on("close", () => {
      const devices = output.split("\n").filter((line) => line.trim()).map((line) => ({ name: line.trim(), id: line.trim() }));
      resolve(devices);
    });
    child.on("error", () => resolve([]));
  });
});
ipcMain.handle("send-file", async (_event, { filePath }) => {
  return new Promise((resolve) => {
    const child = spawn("Transfer-Engine.exe", ["Send", filePath], {
      cwd: process.env.APP_ROOT,
      shell: true
    });
    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.on("close", (code) => resolve({ success: code === 0, output }));
    child.on("error", (err) => resolve({ success: false, output: err.message }));
  });
});
ipcMain.handle("start-receive", async (_, savePath) => {
  return new Promise((resolve) => {
    const args = savePath ? ["Receive", savePath] : ["Receive"];
    const child = spawn("Transfer-Engine.exe", args, {
      cwd: process.env.APP_ROOT,
      shell: true
    });
    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.on("close", (code) => resolve({ success: code === 0, output }));
    child.on("error", (err) => resolve({ success: false, output: err.message }));
  });
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};

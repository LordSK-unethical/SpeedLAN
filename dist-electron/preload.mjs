"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: () => electron.ipcRenderer.invoke("select-file"),
  selectFolder: () => electron.ipcRenderer.invoke("select-folder"),
  scanDevices: () => electron.ipcRenderer.invoke("scan-devices"),
  sendFile: (filePath, deviceId) => electron.ipcRenderer.invoke("send-file", { filePath, deviceId }),
  startReceive: (savePath) => electron.ipcRenderer.invoke("start-receive", savePath)
});

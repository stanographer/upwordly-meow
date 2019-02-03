const electron = require('electron');
const app = electron.app;
const { BrowserWindow, ipcMain, shell } = electron;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const { configPorts } = require('./utils/driverSetup');
const SerialConnection = require('./ComConnect/ConnectToCom');

// Create a new store to persist settings.
const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 430,
    height: 690,
    frame: false
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${ path.join(__dirname, '../build/index.html') }`);

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

// When main process receives send request.
ipcMain.on('set', (event, key, value) => {
  console.log('set request', key, 'to', value);
  store.set(key, value);
  event.sender.send('success', [key, store.get(key)]);
});

// When main process receives a get request.
ipcMain.on('get', (event, key) => {
  console.log('get request:', store.get(key));
  event.sender.send('success', [key, store.get(key)]);
});

ipcMain.on('installDrivers', () => {
  shell.openItem(
    isDev
      ? `${ path.join(__dirname, '../public/utils/vspdxp_install.exe') }`
      : path.join(process.resourcesPath, 'public/utils/vspdxp_install.exe'));
});

ipcMain.on('configPorts', () => {
  shell.openItem(
    isDev
      ? `${ path.join(__dirname, '../public/utils/vspdconfig.exe') }`
      : path.join(process.resourcesPath, 'public/utils/vspdconfig.exe'));
  // shell.openItem(`${ app.getAppPath() }\\public\\utils\\vspdconfig.exe`);
});

ipcMain.on('clearStore', (event, message) => {
  store.clear();
  event.sender.send('success', store);
});

ipcMain.on('connectCom', (event, message) => {
  SerialConnection.start(message);
  event.sender.send('success', 'Connected, yo!');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    ipcMain.removeAllListeners('success');
    ipcMain.removeAllListeners('error');
    ipcMain.removeAllListeners('installDrivers');
    ipcMain.removeAllListeners('configPorts');
    ipcMain.removeAllListeners('clearStore');
    ipcMain.removeAllListeners('connectCom');
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

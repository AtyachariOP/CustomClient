const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const os = require('os');

let throttleInterval = null;
let throttleMemory = [];

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1360,
    height: 720,
    minWidth: 1360,
    minHeight: 720,
    icon: path.join(__dirname, '../public/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    titleBarStyle: 'hidden', // Lunar client style borderless window
    titleBarOverlay: {
      color: 'rgba(0, 0, 0, 0)',
      symbolColor: '#ffffff'
    }
  });

  if (isDev) {
    // In development, load the Vite dev server URL
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built React app
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  return mainWindow;
}

function createDeveloperOptionsWindow(mainWindow) {
  // If it already exists, just focus it
  if (global.developerOptionsWindow && !global.developerOptionsWindow.isDestroyed()) {
    global.developerOptionsWindow.focus();
    return;
  }

  const inspectorWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Developer Options',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  global.developerOptionsWindow = inspectorWindow;

  if (isDev) {
    inspectorWindow.loadURL('http://localhost:5173/inspector.html');
  } else {
    inspectorWindow.loadFile(path.join(__dirname, '../dist/inspector.html'));
  }

  // Setup IPC relays from Inspector -> Main Window
  ipcMain.on('inspector:action', (event, action, ...args) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(`inspector:${action}`, ...args);
    }
  });

  // Setup IPC relays from Main Window -> Inspector (Hover data, Logs, Telemetry)
  ipcMain.on('inspector:relay-data', (event, data) => {
    if (global.developerOptionsWindow && !global.developerOptionsWindow.isDestroyed()) {
      global.developerOptionsWindow.webContents.send('inspector:data-received', data);
    }
  });

  ipcMain.on('inspector:request-hardware', async () => {
    if (!global.developerOptionsWindow || global.developerOptionsWindow.isDestroyed()) return;
    
    try {
      const cpus = os.cpus();
      const gpuInfo = await app.getGPUInfo('complete');
      const gpus = gpuInfo?.gpuDevice || [];
      const primaryGpu = gpus.length > 0 ? gpus[0] : null;

      const hwData = {
        cpu: cpus.length > 0 ? cpus[0].model : 'Unknown CPU',
        ram: Math.round(os.totalmem() / (1024 ** 3)) + ' GB',
        gpu: primaryGpu ? primaryGpu.vendorString + ' ' + primaryGpu.deviceString : 'Unknown GPU',
        os: `${os.type()} ${os.release()}`,
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome
      };
      
      global.developerOptionsWindow.webContents.send('inspector:hardware-received', hwData);
    } catch (err) {
      console.error("Error fetching hardware info:", err);
    }
  });

  // Client resource telemetry (CPU/RAM of the launcher itself)
  ipcMain.on('inspector:request-metrics', () => {
    if (!global.developerOptionsWindow || global.developerOptionsWindow.isDestroyed()) return;
    
    try {
      const metrics = app.getAppMetrics();
      let totalRamKB = 0;
      let totalCpu = 0;
      
      const numCores = os.cpus().length || 1;
      
      metrics.forEach(m => {
        // Electron's workingSetSize is the closest physical memory metric we have.
        // It includes shared memory (like V8), which Task Manager hides by default.
        totalRamKB += m.memory.workingSetSize;
        totalCpu += m.cpu.percentCPUUsage;
      });
      
      global.developerOptionsWindow.webContents.send('inspector:metrics-received', {
        ramMB: Math.round(totalRamKB / 1024),
        // Electron's percentCPUUsage on Windows is already total system percentage.
        cpuPercent: totalCpu.toFixed(1)
      });
    } catch (err) {
      // Ignored
    }
  });
}

app.whenReady().then(() => {
  const mainWindow = createWindow();
  
  // Register Windows + F1 (Super+F1) to open Developer Options
  globalShortcut.register('Super+F1', () => {
    createDeveloperOptionsWindow(mainWindow);
  });
  // Fallback for non-windows
  globalShortcut.register('CommandOrControl+F1', () => {
    createDeveloperOptionsWindow(mainWindow);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const newMain = createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

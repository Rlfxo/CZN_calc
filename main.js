const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Chaos Zero Nightmare Save Data Calculator'
  });

  mainWindow.loadFile('index.html');

  // 개발자 도구 자동 열기 (개발 시)
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // 렌더러에서 종료 요청 처리
  ipcMain.on('quit-app', () => {
    app.quit();
  });

  // 포커스 재설정 요청 처리
  ipcMain.on('restore-focus', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.blur();
      setTimeout(() => {
        mainWindow.focus();
        mainWindow.webContents.focus();
      }, 100);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

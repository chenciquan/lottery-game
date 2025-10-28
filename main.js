const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  // 获取主显示器信息
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    fullscreen: true, // 全屏显示
    frame: false, // 无边框
    resizable: false, // 不可调整大小
    alwaysOnTop: true, // 始终置顶
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载index.html
  mainWindow.loadFile('index.html');

  // 打开开发者工具（可选，生产环境可删除）
  // mainWindow.webContents.openDevTools();
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow);

// 当所有窗口都被关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

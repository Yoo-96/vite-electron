/*
 * @module:
 * @Author: yoo
 * @Date: 2021-11-12 15:07:10
 * @Description:
 */

const { app, BrowserWindow, Tray, ipcMain, Menu, nativeImage, screen } = require('electron');
const path = require('path');
const logoIcon = path.join(__dirname, './public/logo.png');
const root = path.join(__dirname, '../../');

const NODE_ENV = process.env.NODE_ENV;

let mainWindow; // 主窗口实例
let tray; // 托盘实例
let notifyWindow; // 消息通知窗口实例

app.on('ready', () => {
  // 创建一个窗口
  mainWindow = new BrowserWindow({
    frame: false, // 无边框
    resizable: false, // 窗口是否可以改变尺寸
    width: 800,
    height: 600,
    fullscreenable: false, // 窗口是否可以进入全屏状态
    icon: logoIcon,
    webPreferences: {
      backgroundThrottling: false, // 设置应用在后台正常运行
      nodeIntegration: true, // 设置能在页面使用nodejs的API
      contextIsolation: false,
    },
  });

  if (NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(root, '/dist_renderer/index.html'));
  }

  // 开发环境下显示开发者工具
  if (NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // 隐藏菜单栏
  mainWindow.removeMenu();

  // 托盘
  const image = nativeImage.createFromPath(path.join(root, './public/logo.png'));
  tray = new Tray(image.resize({ width: 16, height: 16 }));
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开', type: 'radio', click: () => onChangeTrayMenu('show') },
    { label: '退出', type: 'radio', click: () => onChangeTrayMenu('quit') },
  ]);
  tray.setToolTip('desktop-tools'); // 托盘hover文本
  tray.setContextMenu(contextMenu); // 托盘菜单

  function onChangeTrayMenu(type) {
    switch (type) {
      case 'show':
        mainWindow.show();
        break;
      case 'quit':
        app.quit();
        break;
      default:
        break;
    }
  }

  // 最小化到托盘
  ipcMain.on('mainWindow:close', () => {
    mainWindow.hide();
  });

  // 消息通知
  ipcMain.on('mainWindow:notify', (e, msg) => {
    createNotifyWindow(msg);
  });
});

function createNotifyWindow(msg) {
  if (notifyWindow) notifyWindow.close();

  const size = screen.getPrimaryDisplay().workAreaSize;
  notifyWindow = new BrowserWindow({
    frame: false, // 无边框
    resizable: false, // 窗口是否可以改变尺寸
    width: 140,
    height: 40,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const { height, width } = notifyWindow.getBounds();
  const { y } = tray.getBounds();
  notifyWindow.setBounds({
    x: size.width - width,
    y: 10,
    height,
    width,
  });

  notifyWindow.loadFile(path.join(root, './public/notify.html'));

  // 通知窗口始终处于最上层
  notifyWindow.setAlwaysOnTop(true);
  notifyWindow.show();

  setTimeout(() => {
    notifyWindow.webContents.send('setNotify', msg);
  }, 200);

  notifyWindow.on('closed', () => {
    notifyWindow = null;
  });
  setTimeout(() => {
    notifyWindow && notifyWindow.close();
  }, 3000);
}

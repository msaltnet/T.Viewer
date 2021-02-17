'use strict'

import { app, protocol, BrowserWindow, ipcMain, Menu } from 'electron'
import { spawn } from 'child_process'
import {
    createProtocol //,
    // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import LogService from './LogService'
import SdbManager from './SdbManager'
import template from './menuTemplate'
import path from 'path'
import windowStateKeeper from 'electron-window-state';
import FakeSdbManager from './FakeSdbManager'

const isDevelopment = process.env.NODE_ENV !== 'production'
const useFakeSdb = process.env.NODE_ENV !== 'production' && process.env.VUE_APP_MODE === 'fake'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
    // Create the browser window.
    let iconPath = 'assets/icons/icon.ico';

    // linux AppImage
    if (process.platform !== 'win32') {
        if (process.env.WEBPACK_DEV_SERVER_URL)
            iconPath = 'assets/icons/icon.png';
        else
            iconPath = path.join(__dirname, '../../tviewer.png');
    }

    // Load the previous state with fallback to defaults
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1024,
        defaultHeight: 768
    });

    win = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        webPreferences: {
            nodeIntegration: true
        },
        icon: iconPath,
        show: false
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    mainWindowState.manage(win);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
       win = null
    })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

    }
    createWindow()

    let sdbManager = new SdbManager(spawn);
    if (useFakeSdb) {
        sdbManager = new FakeSdbManager();
    }
    let logService = new LogService(ipcMain, sdbManager);
    logService.init();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

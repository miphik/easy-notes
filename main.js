const {
    app, BrowserWindow, Menu, shell, ipcMain, Tray, session,
} = require('electron');
// const {setContentSecurityPolicy} = require('electron-util');
const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');

const BOUNDS_KEY = 'WINDOW_POSITION';
const PORT = process.env.PORT || 8080;
const IP = process.env.IP || '127.0.0.1';
const isDevelopment = process.env.NODE_ENV !== undefined || process.env.NODE_ENV !== 'production';
const logger = () => {};
const is = () => {};

console.log(`START develop mode is: ${isDevelopment}, NODE_ENV is: ${process.env.NODE_ENV}`);

/* if (isDevelopment) {
    logger = require('electron-timber');
    is = require('electron-util').is;
}*/

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

// Enable live reload for Electron too
/* require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`),
}); */


app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        // In this example, we'll ask the operating system
        // to open this event's url in the default browser.
        event.preventDefault();

        shell.openExternal(navigationUrl);
    });
});

function createMainWindow(data = {}) {
    mainWindow = new BrowserWindow({
        width:                       data.bounds && data.bounds.width ? data.bounds.width : 1280,
        x:                           data.bounds && data.bounds.x ? data.bounds.x : null,
        // fullscreen:   true,
        height:                      data.bounds && data.bounds.height ? data.bounds.height : 880,
        y:                           data.bounds && data.bounds.y ? data.bounds.y : null,
        webPreferences: {
            webSecurity: false
        },
        /* webPreferences: {
            //preload:                        `${__dirname}/preload.js`,
            plugins:                        true,
            nodeIntegration:                false,
            contextIsolation:               true,
            allowRunningInsecureContent:    false,
            allowDisplayingInsecureContent: true,
        },*/
        allowRunningInsecureContent: false,
        minWidth:                    880,
        show:                        true,
        titleBarStyle:               'hidden',
        frame:                       true,
        backgroundColor:             '#fff',
    });

    if (data.isMaximized) mainWindow.maximize();

    mainWindow.on('close', () => storage.set(BOUNDS_KEY, {
        bounds:      mainWindow.getBounds(),
        isMaximized: mainWindow.isMaximized(),
    }, error => {
        if (error) throw error;
    }));

    if (isDevelopment) {
        mainWindow.webContents.openDevTools();
    }
    if (isDevelopment) {
        mainWindow.loadURL(`http://${IP}:${PORT}`);
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.resolve(__dirname, 'build', 'index.html'),
            protocol: 'file',
            slashes:  false,
        }));
    }

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.focus();
        setImmediate(() => {
            mainWindow.focus();
        });
    });

    return mainWindow;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    storage.get(BOUNDS_KEY, (error, data) => {
        if (error) throw error;

        console.log('DATA LOADED ACTIVATE', data);
        if (mainWindow === null) {
            mainWindow = createMainWindow(data);
        }
    });
    // on macOS it is common to re-create a window even after all windows have been closed
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    storage.get(BOUNDS_KEY, (error, data) => {
        if (error) throw error;

        console.log('DATA LOADED', data);
        mainWindow = createMainWindow(data);
    });
    /* if (isDevelopment) {
        logger.log(`Windows: ${is.windows}`);
        logger.log(`Linux: ${is.linux}`);
        logger.log(`MacOS: ${is.macos}`);
        logger.error('Main error');
    }*/
});

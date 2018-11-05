const {
    app, BrowserWindow, Menu, shell, ipcMain, Tray, session,
} = require('electron');
//const {setContentSecurityPolicy} = require('electron-util');
const path = require('path');
const url = require('url');

const isDevelopment = process.env.NODE_ENV !== 'production';
let logger = () => {};
let is = () => {};
/*if (isDevelopment) {
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

function createMainWindow() {
    const window = new BrowserWindow({
        width:          1200,
        height:         800,
        webPreferences: {
            //preload:                        `${__dirname}/preload.js`,
            plugins:                        true,
            nodeIntegration:                false,
            contextIsolation:               true,
            allowRunningInsecureContent:    false,
            allowDisplayingInsecureContent: true,
        },
        allowRunningInsecureContent: false,
        minWidth:                    880,
        show:                        true,
        titleBarStyle:               'hidden',
        frame:                       true,
        backgroundColor:             '#fff',
    });

    if (isDevelopment) {
        window.webContents.openDevTools();
    }
    if (isDevelopment) {
        window.loadURL('http://localhost:8080');
    } else {
        window.loadURL(url.format({
            pathname: path.join(__dirname, 'build', 'index.html'),
            protocol: 'file',
            slashes:  true,
        }));
    }

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow();
    /*if (isDevelopment) {
        logger.log(`Windows: ${is.windows}`);
        logger.log(`Linux: ${is.linux}`);
        logger.log(`MacOS: ${is.macos}`);
        logger.error('Main error');
    }*/
});

/**
 * Reference ELectron.js docs https://www.electronjs.org/docs/tutorial/quick-start
 */
const {app, BrowserWindow} = require('electron');
const path = require("path");

// Build a new browser window for your app to open up
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadURL('http://localhost:3000').then(r => {
        console.log(r)
    });
}

// Once app is initialized, create the app
app.whenReady().then(createWindow);

// Quit the app when no windows are open
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Only create a new window if no windows are already open (prevents your app being open multiple times)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

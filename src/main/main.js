const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const attachIpcListeners = require("./attatchIpcListeners");

const focusedWindowSend = (channel) => {
    BrowserWindow.getFocusedWindow().webContents.send(channel);
};

Menu.setApplicationMenu(
    Menu.buildFromTemplate([
        {
            label: "File",
            submenu: [
                {
                    label: "Save",
                    click: () => {
                        focusedWindowSend("save-script");
                    },
                    accelerator: "Ctrl+S",
                },
            ],
        },
        {
            label: "Developer",
            submenu: [
                {
                    label: "Inspect Element",
                    role: "toggleDevTools",
                },
                {
                    label: "Reload Page",
                    role: "reload",
                },
            ],
        },
    ])
);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile("../renderer/pages/menu/menu.html");
};

app.once("ready", () => {
    createWindow();
    attachIpcListeners();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

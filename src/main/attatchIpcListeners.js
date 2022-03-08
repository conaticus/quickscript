const { dialog, ipcMain } = require("electron");

const attatchIpcListeners = () => {
    ipcMain.handle("request-file-dialog", async (_, options) => {
        const dialogChoice = await dialog.showOpenDialog(options);
        return dialogChoice.filePaths[0];
    });

    ipcMain.handle("request-message-box", async (_, options) => {
        const dialogChoice = await dialog.showMessageBox(options);
        return dialogChoice.response;
    });
};

module.exports = attatchIpcListeners;

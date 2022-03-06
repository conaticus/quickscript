const { dialog, ipcMain } = require("electron");

const attatchIpcListeners = () => {
    ipcMain.handle("request-file-dialog", async (_, options) => {
        const dialogChoice = await dialog.showOpenDialog(options);
        return dialogChoice.filePaths[0];
    });
};

module.exports = attatchIpcListeners;

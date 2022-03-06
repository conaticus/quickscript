const { ipcRenderer } = require("electron");
const fs = require("fs/promises");

const createScriptForm = document.getElementById("create-script-form");
const pathBtn = document.getElementById("path-btn");
const openScriptBtn = document.getElementById("open-script-btn");

const scriptNameInput = createScriptForm.children.item(0);
const scriptPathInput = createScriptForm.children.item(1);

/**
 * Display error to the user
 * @param {string} message
 */
const displayError = (message) => {
    alert(`[ERROR]: ${message}`);
};

/**
 * Set the current script path for loading scripts
 * @param {string} path
 */
const setCurrentScriptPath = (path) => {
    localStorage.setItem("currentScriptDirectory", path);
};

/** Load the script editor */
const loadEditor = () => {
    location.href = "../editor/editor.html";
};

/** Open file dialog to specify a directory for the script project */
pathBtn.addEventListener("click", async () => {
    const dialogChoice = await ipcRenderer.invoke("request-file-dialog", {
        properties: ["openDirectory"],
    });

    if (!dialogChoice) return;

    // If a script name has been provided, add that to the path
    scriptPathInput.value = dialogChoice;
    if (scriptNameInput.value) {
        scriptPathInput.value += `\\${scriptNameInput.value}`;
    }
});

createScriptForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        // Check if directory exists & is empty

        const dirContents = await fs.readdir(scriptPathInput.value);
        // Display error if directory contains files
        if (dirContents.length !== 0) {
            return displayError(
                `'${scriptPathInput.value}' is not empty. Directory must be empty to proceed.`
            );
        }
    } catch {
        // Catch if file is either a file or doesn't exist.

        try {
            // Check if path is to a file
            const fileStats = await fs.stat(scriptPathInput.value);
            if (fileStats.isFile()) {
                displayError(
                    `'${scriptPathInput.value}' is a file. Please specify a directory in order to proceed.`
                );
            }

            return;
        } catch {
            // Catch if there is no file or directory to the given path
            await fs.mkdir(scriptPathInput.value);
        }
    }

    // Create a save.json and load the editor
    const save = JSON.stringify({
        name: scriptNameInput.value,
        contents: "",
        comments: [],
    });
    await fs.writeFile(`${scriptPathInput.value}/save.json`, save);

    setCurrentScriptPath(scriptPathInput.value);
    loadEditor();
});

// Open a script and load into editor
openScriptBtn.addEventListener("click", async () => {
    const dialogChoice = await ipcRenderer.invoke("request-file-dialog", {
        properties: ["openDirectory"],
    });

    if (!dialogChoice) return;

    const directoryContents = await fs.readdir(dialogChoice);
    if (!directoryContents.includes("save.json")) {
        return displayError("Directory does not include a 'save.json'");
    }

    setCurrentScriptPath(dialogChoice);
    loadEditor();
});

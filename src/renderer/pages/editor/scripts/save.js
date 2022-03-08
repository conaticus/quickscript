import { scriptingInputArea, state } from "./editor.js";

const fs = require("fs/promises");

const currentScriptDirectory = localStorage.getItem("currentScriptDirectory");

/** Load script.json into editor */
export const loadScript = async () => {
    const scriptSaveRaw = await fs.readFile(
        `${currentScriptDirectory}/save.json`,
        "utf8"
    );

    state.newSave = JSON.parse(scriptSaveRaw);

    document.title = `Quick Script Editor - ${state.newSave.name}`;
    scriptingInputArea.value = state.newSave.contents;
};

/** Save script file */
export const save = async () => {
    await fs.writeFile(
        `${currentScriptDirectory}/save.json`,
        JSON.stringify(state.newSave)
    );
};

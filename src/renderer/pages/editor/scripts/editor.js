import {
    createOptionMenuOption,
    toggleOptionsMenu,
    closeOptionsMenu,
} from "./optionMenu.js";
import { openCommentMenu, deleteComment } from "./commentMenu.js";
import {
    addShortcuts,
    addNavigationListeners,
    addZoomListeners,
} from "./shortcuts.js";
import { loadScript, save } from "./save.js";
import { selectSentence, nextSentence, previousSentence } from "./selection.js";

const { ipcRenderer } = require("electron");

export const scriptingInputArea = document.getElementById(
    "scripting-input-area"
);
scriptingInputArea.focus();

export const state = {
    newSave: {},
};

scriptingInputArea.addEventListener("input", () => {
    state.newSave.contents = scriptingInputArea.value;
});

scriptingInputArea.addEventListener("keydown", (e) => {
    if (e.key !== "Backspace") return;

    state.newSave.comments.forEach(async (comment) => {
        if (comment.endIdx !== scriptingInputArea.selectionEnd) return;
        e.preventDefault();

        const dialogChoice = await ipcRenderer.invoke("request-message-box", {
            message: "This text contains a comment, do you wish to delete it?",
            type: "question",
            buttons: ["Yes", "No"],
        });

        if (dialogChoice === 1) return;

        deleteComment(comment.startIdx, comment.endIdx);
        // Remove the last character
        scriptingInputArea.value = scriptingInputArea.value.substring(
            0,
            scriptingInputArea.value.length - 1
        );
    });
});

createOptionMenuOption("Add/Edit Comment", () => {
    closeOptionsMenu();
    openCommentMenu();
});

createOptionMenuOption("Clear Comment", () => {
    deleteComment(
        scriptingInputArea.selectionStart,
        scriptingInputArea.selectionEnd
    );

    closeOptionsMenu();
});

ipcRenderer.on("save-script", async () => {
    await save();
});

addNavigationListeners();
addShortcuts([
    ["s", selectSentence],
    ["o", toggleOptionsMenu],
    ["ArrowRight", nextSentence],
    ["ArrowLeft", previousSentence],
    [
        "m",
        async () => {
            await save();
            location.href = "../view/view.html";
        },
    ],
]);
addZoomListeners();

loadScript();

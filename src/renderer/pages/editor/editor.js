const { ipcRenderer } = require("electron");
const fs = require("fs/promises");

const scriptingInputArea = document.getElementById("scripting-input-area");
scriptingInputArea.focus();

const currentScriptDirectory = localStorage.getItem("currentScriptDirectory");
let newSave = {};

/**
 * Create option for option menu
 * @param {string} text
 * @param {Function} onclick
 */
const createOptionMenuOption = (text, callback) => {
    const option = document.createElement("div");
    option.innerText = text;
    option.className = "options-menu-option";

    option.onclick = callback;
    options.push({ element: option, callback });
};

let optionsMenuOpen = false;
let currentOptionIdx = 0;
const options = [];

const optionsMenu = document.createElement("div");
optionsMenu.className = "menu options-menu";
optionsMenu.style.display = "none";

options.forEach(({ element }) => {
    optionsMenu.appendChild(element);
});

createOptionMenuOption("Add/Edit Comment", () => {
    closeOptionsMenu();
    openCommentMenu();
});

createOptionMenuOption("Other Option", () => {});

options.forEach((option) => {
    optionsMenu.appendChild(option.element);
});

document.body.appendChild(optionsMenu);

const whiteSpaceChars = [" ", "\t", "\n"];

let commentMenuOpen = false;

const commentMenu = document.createElement("div");
commentMenu.className = "menu comment-menu";

const commentInput = document.createElement("input");
commentMenu.appendChild(commentInput);

commentMenu.style.display = "none";
document.body.appendChild(commentMenu);

scriptingInputArea.addEventListener("change", () => {
    newSave.contents = scriptingInputArea.value;
});

/**
 * Creates shortcuts, always required to start with ALT
 * @param {[string, Function][]} shortcuts
 */
const addShortcuts = (shortcuts) => {
    addEventListener("keydown", ({ altKey, key }) => {
        if (!altKey) return;

        shortcuts.forEach(([shortcutKey, callback]) => {
            if (key !== shortcutKey) return;
            callback();
        });
    });
};

/** Load script.json into editor */
const loadScript = async () => {
    const scriptSaveRaw = await fs.readFile(
        `${currentScriptDirectory}/save.json`,
        "utf8"
    );

    newSave = JSON.parse(scriptSaveRaw);

    document.title = `Quick Script Editor - ${newSave.name}`;
    scriptingInputArea.value = newSave.contents;
};

const save = async () => {
    await fs.writeFile(
        `${currentScriptDirectory}/save.json`,
        JSON.stringify(newSave)
    );
};

/** Save script file */
ipcRenderer.on("save-script", async () => {
    await save();
});

const selectSentence = () => {
    const startIndex = scriptingInputArea.selectionStart;

    const scriptBehindCursor = scriptingInputArea.value.substring(
        0,
        startIndex
    );

    let selectStartIdx = 0;

    for (let i = scriptBehindCursor.length - 1; i >= 0; i--) {
        const char = scriptBehindCursor[i];
        if (char === ".") {
            selectStartIdx = i + 1;
            break;
        }
    }

    let selectEndIdx = scriptingInputArea.value.length;

    const scriptAheadCursor = scriptingInputArea.value.substring(startIndex);

    for (let i = 0; i < scriptAheadCursor.length; i++) {
        const char = scriptAheadCursor[i];
        if (char === ".") {
            selectEndIdx = i + scriptBehindCursor.length;
            break;
        }
    }

    selectStartIdx = removeSelectionSpaceStart(selectStartIdx);
    selectEndIdx = removeSelectionSpaceEnd(selectEndIdx);

    scriptingInputArea.setSelectionRange(selectStartIdx, selectEndIdx);
};

const removeSelectionSpaceStart = (selectStartIdx) => {
    while (whiteSpaceChars.includes(scriptingInputArea.value[selectStartIdx])) {
        selectStartIdx++;
    }

    return selectStartIdx;
};

const removeSelectionSpaceEnd = (selectEndIdx) => {
    while (whiteSpaceChars.includes(scriptingInputArea.value[selectEndIdx])) {
        selectEndIdx--;
    }

    return selectEndIdx;
};

const closeOptionsMenu = () => {
    optionsMenu.style.display = "none";
    optionsMenuOpen = false;
    scriptingInputArea.focus();
};

const toggleOptionsMenu = () => {
    if (optionsMenuOpen) {
        closeOptionsMenu();
        return;
    }

    if (scriptingInputArea.selectionStart === scriptingInputArea.selectionEnd)
        return;

    optionsMenuOpen = true;
    optionsMenu.style.display = "block";

    scriptingInputArea.blur();
};

const showOptionBorder = (element) => {
    options.forEach((option) => {
        option.element.style.border = "none";
    });

    element.style.border = "solid 2px white";
};

const addNavgiationListeners = () => {
    showOptionBorder(options[currentOptionIdx].element);

    addEventListener("keydown", (e) => {
        const navKeys = [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Enter",
            "Escape",
        ];

        if (!navKeys.includes(e.key)) return;

        if (optionsMenuOpen) {
            e.preventDefault();

            if (e.key === "ArrowDown") {
                if (!options[currentOptionIdx + 1]) {
                    currentOptionIdx = 0;
                    showOptionBorder(options[currentOptionIdx].element);
                    return;
                }

                currentOptionIdx++;
                showOptionBorder(options[currentOptionIdx].element);
            } else if (e.key === "ArrowUp") {
                if (!options[currentOptionIdx - 1]) {
                    currentOptionIdx = options.length - 1;
                    showOptionBorder(options[currentOptionIdx].element);
                    return;
                }

                currentOptionIdx--;
                showOptionBorder(options[currentOptionIdx].element);
            } else if (e.key === "Enter") {
                options[currentOptionIdx].callback();
            } else if (e.key === "Escape") {
                closeOptionsMenu();
            }

            return;
        }

        if (e.key === "Escape") {
            if (commentMenuOpen) {
                closeCommentMenu();
            } else {
                scriptingInputArea.setSelectionRange(0, 0);
            }
        }
    });
};

const nextSentence = () => {
    let selectionEndIdx = scriptingInputArea.value.length - 1;

    for (
        let i = scriptingInputArea.selectionEnd + 1;
        i < scriptingInputArea.value.length;
        i++
    ) {
        const char = scriptingInputArea.value[i];
        if (char === ".") {
            selectionEndIdx = i;
            break;
        }
    }

    scriptingInputArea.setSelectionRange(
        scriptingInputArea.selectionStart,
        selectionEndIdx + 1
    );
};

const previousSentence = () => {
    let firstDotOccured = false;
    let selectionStartIdx = 0;
    // get selection start
    // iterate until dot
    // that will be the current sentence end index

    let firstSentenceEndIdx = scriptingInputArea.selectionEnd - 1;

    for (
        let i = scriptingInputArea.selectionStart;
        i < scriptingInputArea.selectionEnd;
        i++
    ) {
        const char = scriptingInputArea.value[i];
        if (char === ".") {
            firstSentenceEndIdx = i;
            break;
        }
    }

    for (let i = firstSentenceEndIdx - 1; i >= 0; i--) {
        const char = scriptingInputArea.value[i];
        if (char === ".") {
            if (firstDotOccured) {
                selectionStartIdx = i;
                break;
            } else firstDotOccured = true;
        }
    }

    if (selectionStartIdx === 0) selectionStartIdx -= 1;

    // Increment selectionStartIdx to ignore first full stop
    selectionStartIdx = removeSelectionSpaceStart(++selectionStartIdx);

    scriptingInputArea.setSelectionRange(
        selectionStartIdx,
        scriptingInputArea.selectionEnd
    );
};

const openCommentMenu = () => {
    newSave.comments.forEach((comment) => {
        if (
            scriptingInputArea.selectionStart === comment.startIdx &&
            scriptingInputArea.selectionEnd === comment.endIdx
        ) {
            commentInput.value = comment.value;
        }
    });

    commentMenu.style.display = "block";
    commentInput.focus();
    commentMenuOpen = true;
};

const closeCommentMenu = () => {
    if (!commentMenuOpen) return;

    commentMenu.style.display = "none";
    commentMenuOpen = false;

    const filteredComments = newSave.comments.filter(
        (comment) =>
            comment.startIdx === scriptingInputArea.selectionStart &&
            comment.endIdx === scriptingInputArea.selectionEnd
    );

    if (filteredComments.length === 0) {
        if (commentInput.value === "") return;

        newSave.comments.push({
            startIdx: scriptingInputArea.selectionStart,
            endIdx: scriptingInputArea.selectionEnd,
            value: commentInput.value,
        });
    } else {
        if (commentInput.value === "") {
            const newComments = newSave.comments.filter(
                (comment) =>
                    comment.startIdx !== scriptingInputArea.selectionStart &&
                    comment.endIdx !== scriptingInputArea.selectionEnd
            );

            newSave.comments = newComments;
        }
    }

    commentInput.value = "";
    scriptingInputArea.focus();
};

const viewMode = async () => {
    await save();
    location.href = "../view/view.html";
};

addNavgiationListeners();
addShortcuts([
    ["s", selectSentence],
    ["o", toggleOptionsMenu],
    ["ArrowRight", nextSentence],
    ["ArrowLeft", previousSentence],
    ["m", viewMode],
]);

loadScript();

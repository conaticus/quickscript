import { scriptingInputArea } from "./editor.js";

const whiteSpaceChars = [" ", "\t", "\n"];

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

export const selectSentence = () => {
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

export const nextSentence = () => {
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

export const previousSentence = () => {
    let firstDotOccured = false;
    let selectionStartIdx = 0;

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

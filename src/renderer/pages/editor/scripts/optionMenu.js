import { scriptingInputArea } from "./editor.js";

export let optionsMenuOpen = false;
export let currentOptionIdx = 0;
export const options = [];

const optionsMenu = document.createElement("div");
optionsMenu.className = "menu options-menu";
optionsMenu.style.display = "none";

document.body.appendChild(optionsMenu);

export const incrementOptionIdx = () => {
    currentOptionIdx++;
};

export const decrementOptionIdx = () => {
    currentOptionIdx--;
};

/**
 * Create option for option menu
 * @param {string} text
 * @param {Function} onclick
 */
export const createOptionMenuOption = (text, callback) => {
    const option = document.createElement("div");
    option.innerText = text;
    option.className = "options-menu-option";

    option.onclick = callback;
    options.push({ element: option, callback });

    optionsMenu.appendChild(option);
};

export const toggleOptionsMenu = () => {
    optionsMenuOpen = !optionsMenuOpen;

    if (!optionsMenuOpen) {
        closeOptionsMenu();
        return;
    }

    if (scriptingInputArea.selectionStart === scriptingInputArea.selectionEnd)
        return;

    optionsMenu.style.display = "block";

    scriptingInputArea.blur();
};

export const closeOptionsMenu = () => {
    optionsMenu.style.display = "none";
    optionsMenuOpen = false;
    scriptingInputArea.focus();
};

export const showOptionBorder = (element) => {
    options.forEach((option) => {
        option.element.style.border = "none";
    });

    element.style.border = "solid 2px white";
};

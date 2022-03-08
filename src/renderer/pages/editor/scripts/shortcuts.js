import { commentMenuOpen, closeCommentMenu } from "./commentMenu.js";
import {
    optionsMenuOpen,
    currentOptionIdx,
    options,
    showOptionBorder,
    incrementOptionIdx,
    decrementOptionIdx,
    closeOptionsMenu,
} from "./optionMenu.js";
import { scriptingInputArea } from "./editor.js";
import pxToNumber from "../util/pxToNumber.js";

/**
 * Creates shortcuts, always required to start with ALT
 * @param {[string, Function][]} shortcuts
 */
export const addShortcuts = (shortcuts) => {
    addEventListener("keydown", ({ altKey, key }) => {
        if (!altKey) return;

        shortcuts.forEach(([shortcutKey, callback]) => {
            if (key !== shortcutKey) return;
            callback();
        });
    });
};

export const addNavigationListeners = () => {
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

                incrementOptionIdx();
                showOptionBorder(options[currentOptionIdx].element);
            } else if (e.key === "ArrowUp") {
                if (!options[currentOptionIdx - 1]) {
                    currentOptionIdx = options.length - 1;
                    showOptionBorder(options[currentOptionIdx].element);
                    return;
                }

                decrementOptionIdx();
                showOptionBorder(options[currentOptionIdx].element);
            } else if (e.key === "Enter") {
                options[currentOptionIdx].callback();
            } else if (e.key === "Escape") {
                closeOptionsMenu();
            }

            return;
        }

        if (commentMenuOpen) {
            if (e.key === "Escape") {
                e.preventDefault();
                closeCommentMenu();
            }

            return;
        }

        if (e.key === "Escape") {
            scriptingInputArea.setSelectionRange(0, 0);
        }
    });
};

export const addZoomListeners = () => {
    addEventListener("keydown", ({ key, ctrlKey }) => {
        if (!ctrlKey) return;

        const fontSize = parseFloat(
            getComputedStyle(scriptingInputArea, null).fontSize
        );

        if (key === "=") {
            scriptingInputArea.style.fontSize = `${fontSize + 3}px`;
        } else if (key === "-") {
            scriptingInputArea.style.fontSize = `${fontSize - 3}px`;
        }
    });
};

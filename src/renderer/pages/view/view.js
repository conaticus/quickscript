const currentScriptDirectory = localStorage.getItem("currentScriptDirectory");
const fs = require("fs/promises");

let scriptSave = {};

const commentDisplayElement = document.createElement("div");
commentDisplayElement.className = "comment-display";
commentDisplayElement.style.display = "none";
document.body.appendChild(commentDisplayElement);

let showComments = false;

/** Load script.json into view */
const loadScript = async () => {
    const scriptSaveRaw = await fs.readFile(
        `${currentScriptDirectory}/save.json`,
        "utf8"
    );

    scriptSave = JSON.parse(scriptSaveRaw);

    document.title = `Quick Script View - ${scriptSave.name}`;

    const contentParent = document.createElement("p");
    document.body.appendChild(contentParent);
    for (let i = 0; i < scriptSave.contents.length; i++) {
        let spanText = scriptSave.contents[i];

        const span = document.createElement("span");
        contentParent.appendChild(span);

        scriptSave.comments.forEach((comment) => {
            if (comment.startIdx === i) {
                spanText = "";

                span.className = "comment";
                span.addEventListener("mouseover", () => {
                    if (showComments) {
                        commentDisplayElement.textContent = comment.value;
                        commentDisplayElement.style.display = "block";
                    }
                });

                span.addEventListener("mouseleave", () => {
                    if (showComments) {
                        commentDisplayElement.style.display = "none";
                    }
                });

                while (i <= comment.endIdx) {
                    spanText += scriptSave.contents[i];
                    i++;
                }

                i--; // decrement i to remain in sync with the loop

                return;
            }
        });

        span.textContent = spanText;
    }
};

loadScript();

const toggleShowComments = () => {
    showComments = !showComments;
    const comments = document.getElementsByClassName("comment");

    if (showComments) {
        for (let i = 0; i < comments.length; i++) {
            const comment = comments.item(i);
            comment.style.backgroundColor = "yellow";
        }
    } else {
        for (let i = 0; i < comments.length; i++) {
            const comment = comments.item(i);
            comment.style.background = "none";
        }
    }
};

addEventListener("keydown", ({ altKey, key }) => {
    if (!altKey) return;

    if (key === "m") {
        location.href = "../editor/editor.html";
        return;
    }

    if (key === "c") {
        toggleShowComments();
        return;
    }
});

addEventListener("keydown", ({ key, ctrlKey }) => {
    if (!ctrlKey) return;

    const fontSize = parseFloat(getComputedStyle(document.body, null).fontSize);

    if (key === "=") {
        document.body.style.fontSize = `${fontSize + 1}px`;
    } else if (key === "-") {
        document.body.style.fontSize = `${fontSize - 1}px`;
    }
});

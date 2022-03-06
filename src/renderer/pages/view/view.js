const currentScriptDirectory = localStorage.getItem("currentScriptDirectory");
const fs = require("fs/promises");

let scriptSave = {};

const commentDisplayElement = document.createElement("div");
commentDisplayElement.className = "comment-display";
commentDisplayElement.style.display = "none";
document.body.appendChild(commentDisplayElement);

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
                span.style.backgroundColor = "yellow";
                span.addEventListener("mouseover", () => {
                    commentDisplayElement.textContent = comment.value;
                    commentDisplayElement.style.display = "block";
                });

                span.addEventListener("mouseleave", () => {
                    commentDisplayElement.style.display = "none";
                });

                while (i <= comment.endIdx) {
                    spanText += scriptSave.contents[i];
                    i++;
                }

                return;
            }
        });

        span.textContent = spanText;
    }
};

loadScript();

addEventListener("keydown", ({ altKey, key }) => {
    if (!altKey) return;

    if (key === "m") {
        location.href = "../editor/editor.html";
    }
});

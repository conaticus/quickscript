import { state, scriptingInputArea } from "./editor.js";

/* Comment menu displays when adding a new comment */

export let commentMenuOpen = false;

const commentMenu = document.createElement("div");
commentMenu.className = "menu comment-menu";

const commentInput = document.createElement("textarea");
commentInput.placeholder = "Your comment";
commentMenu.appendChild(commentInput);

commentMenu.style.display = "none";
document.body.appendChild(commentMenu);

/**
 * Show the comment menu
 */
export const openCommentMenu = () => {
    // Check if the text already has a comment and add to input field if so
    state.newSave.comments.forEach((comment) => {
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

/**
 * Delete a comment with a specific start and end index
 * @param {number} startIdx
 * @param {number} endIdx
 */
export const deleteComment = (startIdx, endIdx) => {
    state.newSave.comments = state.newSave.comments.filter(
        (comment) => comment.startIdx !== startIdx && comment.endIdx !== endIdx
    );
};

/**
 * Hide the comment menu
 */
export const closeCommentMenu = () => {
    if (!commentMenuOpen) return;

    commentMenu.style.display = "none";
    commentMenuOpen = false;

    const filteredComments = state.newSave.comments.filter(
        (comment) =>
            comment.startIdx === scriptingInputArea.selectionStart &&
            comment.endIdx === scriptingInputArea.selectionEnd
    );

    if (filteredComments.length === 0) {
        if (commentInput.value === "") return;

        state.newSave.comments.push({
            startIdx: scriptingInputArea.selectionStart,
            endIdx: scriptingInputArea.selectionEnd,
            value: commentInput.value,
        });
    } else {
        if (commentInput.value === "") {
            deleteComment(
                scriptingInputArea.selectionStart,
                scriptingInputArea.selectionEnd
            );

            state.newSave.comments = newComments;
        } else {
            state.newSave.comments[
                state.newSave.comments.indexOf(filteredComments[0])
            ].value = commentInput.value;
        }
    }

    commentInput.value = "";
    scriptingInputArea.focus();
};

/**
 * Converts pixel string to number
 * @param {string} str
 * @returns {number} Number value of pixel string
 */
const pxToNumber = (str) => {
    return Number(str.substring(0, str.length - 2));
};

export default pxToNumber;

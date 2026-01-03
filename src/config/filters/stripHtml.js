const striptags = require("striptags");

module.exports = function (value) {
    return striptags(value);
};
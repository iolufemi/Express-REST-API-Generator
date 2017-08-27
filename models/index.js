"use strict";

var models = {};
var normalizedPath = require("path").join(__dirname, "./");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    var splitFileName = file.split('.');
    if(splitFileName[0] !== 'index'){
        models[splitFileName[0]] = require('./'+splitFileName[0]);
    }
});

module.exports = models;

'use strict';
var _ = require('lodash');

var models = {};
var normalizedPath = require('path').join(__dirname, './');

var files = require('fs').readdirSync(normalizedPath);
var filesCount = files.length * 1;
var count = 0;
var associate = function(models){
    _.forOwn(models, function(value, key){
        if(value.associate){
            value.associate(models);
        }
    });
};

files.forEach(function(file) {
    count = count + 1;
    var splitFileName = file.split('.');
    if (splitFileName[0] !== 'index') {
        models[splitFileName[0]] = require('./' + splitFileName[0]);
    }
    if (count === filesCount) {
        associate(models);
    }
});

module.exports = models;
// Todo: Automatically generate tests with the schema structure
// Add the option of elasticsearch for API search

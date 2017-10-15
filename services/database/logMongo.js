"use strict";
var mongoose = require('mongoose');
var config = require('../../config');
var log = require('../../services/logger');

mongoose.Promise = require('q').Promise;

// Connect to DB
var db = mongoose.createConnection(config.logMongoURL);

db.on('error', log.error);
db.once('open', function() {
    log.info('Log mongoDB database connection successful');
});

module.exports = db;
module.exports._mongoose = mongoose;

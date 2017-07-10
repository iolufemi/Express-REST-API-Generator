"use strict";
var mongoose = require('mongoose');
var config = require('../../config');
var log = require('../../services/logger');

// Connect to DB
mongoose.connect(config.mongoURL);

// Set the prefered promise library
mongoose.Promise = require('q').Promise;

var db = mongoose.connection;

db.on('error', log.error);
db.once('open', function() {
  log.info('MongoDB database connection successful');
});

module.exports = mongoose;

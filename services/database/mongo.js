"use strict";
var mongoose = require('mongoose');
var config = require('../../config');
var log = require('../../services/logger');

mongoose.Promise = require('q').Promise;
// Connect to DB
var mongooseConfig = {};
mongooseConfig.config = {};
if(config.env === 'production'){
	mongooseConfig.config.autoIndex = false;
}
var db = mongoose.createConnection(config.mongoURL, mongooseConfig);

db.on('error', log.error);
db.once('open', function() {
	log.info('MongoDB database connection successful');
});

module.exports = db;
module.exports._mongoose = mongoose;

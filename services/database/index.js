"use strict";

var databases = {
    logMongo: require('./logMongo'),
    mongo: require('./mongo'),
    redis: require('./redis'),
    api: require('./api')
};

module.exports = databases;

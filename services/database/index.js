"use strict";

var databases = {
    mongo: require('./mongo'),
    redis: require('./redis')
};

module.exports = databases;

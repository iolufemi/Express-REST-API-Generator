"use strict";
var redis = require('redis');
var config = require('../../config');
var log = require('../../services/logger');

var client = redis.createClient(config.redisURL);

client.on("error", log.error);

client.on("connect", function() {
    log.info('Redis database connection successful');
});

module.exports = client;

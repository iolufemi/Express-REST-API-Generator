'use strict';
var config = require('../../config');

var databases = {
    logMongo: require('./logMongo'),
    mongo: require('./mongo'),
    redis: require('./redis'),
    api: require('./api')
};

if(config.disableMySQL !== 'yes'){
    databases.sql =  require('./sql');
}
module.exports = databases;

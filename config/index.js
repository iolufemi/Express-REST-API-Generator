'use strict';

var env = {
    development : require('./development'),
    production : require('./production')
    // test
}

module.exports = env[process.env.NODE_ENV ? process.env.NODE_ENV : 'development'];
// ToDo: Test for production and development senarios

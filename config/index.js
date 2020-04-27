'use strict';

module.exports = {
    development : require('./development'),
    production : require('./production')
    // test
}[process.env.NODE_ENV || 'development'];
// ToDo: Test for production and development senarios

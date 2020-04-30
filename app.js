'use strict';
var cluster = require('cluster');
var config = require('./config');
var log = require('./services/logger');
var basicAuth = require('basic-auth-connect');
var express = require('express');
var app;
var server;

if (cluster.isMaster && config.env === 'production') {
    var kue = require('./services/queue').kue;
    app = express();
    app.use(basicAuth(config.queueUIUsername, config.queueUIPassword));
    app.use(kue.app);
    server = app.listen(config.queueUIPort, function () {
        var host = server.address().address;
        var port = server.address().port;
        log.info('Queue UI listening on host '+host+', port '+port+'!');
    });
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker,
        // we're not sentimental
        log.info('Worker %d died', worker.id);
        cluster.fork();
    });

} else {
    app = express();
    var router = require('./routes');
    var express_enforces_ssl = require('express-enforces-ssl');

    if(config.trustProxy === 'yes'){
        app.enable('trust proxy');
    }

    if(config.enforceSSL === 'yes'){
        app.use(express_enforces_ssl());
    }

    app.use('/',router);

    if(config.env === 'production'){
        log.info('Worker %d running!', cluster.worker.id);
    }


    server = app.listen(config.port, function () {
        var host = server.address().address;
        var port = server.address().port;
        log.info('API server listening on host '+host+', port '+port+'!');
    });

}
// ToDo: Write a complete Documentation for this project

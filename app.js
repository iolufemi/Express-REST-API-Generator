"use strict";
var cluster = require('cluster');
var config = require('./config');
var log = require('./services/logger');

if (cluster.isMaster && config.env === 'production') {
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
	var express = require('express');
	var app = express();
	var router = require('./routes');

	if(config.trustProxy === 'yes'){
		app.enable('trust proxy');
	}

	// app.use('/',router);
	
	if(config.env === 'production'){
		log.info('Worker %d running!', cluster.worker.id);
	}
	

	app.listen(config.port, function () {
		log.info('listening on port '+config.port+'!');
	});

}

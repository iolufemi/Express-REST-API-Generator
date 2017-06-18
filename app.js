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
    var helmet = require('helmet');
    var client = require('redis').createClient(config.redisURL);
    var limiter = require('express-limiter')(app, client);

    if(config.trustProxy === 'yes'){
      app.enable('trust proxy');
  }


  app.use(helmet());
    // no client side caching
    if(config.noFrontendCaching === 'yes'){
        app.use(helmet.noCache());
    }

    limiter({
      path: '*',
      method: 'all',
      lookup: 'userId',
      total: config.rateLimit * 1,
      expire: config.rateLimitExpiry * 1,
      onRateLimited: function (req, res, next) {
        next({ message: 'Rate limit exceeded', statusCode: 429 });
    }
});

    app.use('/',router);

    if(config.env === 'production'){
      log.info('Worker %d running!', cluster.worker.id);
  }


  app.listen(config.port, function () {
      log.info('listening on port '+config.port+'!');
  });

}

'use strict';

var queue = require('./');
var jobs = require('./jobs');
var config = require('../../config');
var concurrency = config.workerConcurrency * 1;
// Sets the number of listeners to prevent the annoying memory leak error.
var maxListeners = 20 * concurrency;
queue.setMaxListeners(maxListeners);

queue.process('searchIndex', concurrency, function(job, done){
    jobs.createSearchTags(job.data, done);
});

queue.process('logRequest', concurrency, function(job, done){
    jobs.createRequestLog(job.data, done);
});

queue.process('logResponse', concurrency, function(job, done){
    jobs.updateRequestLog(job.data, done);
});

queue.process('saveToTrash', concurrency, function(job, done){
    jobs.saveToTrash(job.data, done);
});

queue.process('sendWebhook', concurrency, function(job,done){
    jobs.sendWebhook(job.data, done);
});

queue.process('sendHTTPRequest', concurrency, function(job,done){
    jobs.sendHTTPRequest(job.data, done);
});

module.exports = queue;

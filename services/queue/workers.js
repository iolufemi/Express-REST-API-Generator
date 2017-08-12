"use strict";

var queue = require('./');
var jobs = require('./jobs');

queue.process('searchIndex',2, function(job, done){
    jobs.createSearchTags(job.data, done);
});

queue.process('logRequest',2, function(job, done){
    jobs.createRequestLog(job.data, done);
});

queue.process('logResponse',2, function(job, done){
    jobs.updateRequestLog(job.data, done);
});

// ToDo: Add Webhook worker here

module.exports = queue;

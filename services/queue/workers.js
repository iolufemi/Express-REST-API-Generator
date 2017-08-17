"use strict";

var queue = require('./');
var jobs = require('./jobs');

queue.process('searchIndex', function(job, done){
    jobs.createSearchTags(job.data, done);
});

queue.process('logRequest', function(job, done){
    jobs.createRequestLog(job.data, done);
});

queue.process('logResponse', function(job, done){
    jobs.updateRequestLog(job.data, done);
});

queue.process('saveToTrash', function(job, done){
    jobs.saveToTrash(job.data, done);
});

queue.process('sendWebhook', function(job,done){
    jobs.sendWebhook(job.data, done);
});

queue.process('sendHTTPRequest', function(job,done){
    jobs.sendHTTPRequest(job.data, done);
});

module.exports = queue;

"use strict";

var queue = require('./');
var jobs = require('./jobs');

queue.process('searchIndex', 2, function(job, done){
    jobs.createSearchTags(job.data, done);
});

queue.process('logRequest', 2, function(job, done){
    jobs.createRequestLog(job.data, done);
});

queue.process('logResponse', 2, function(job, done){
    jobs.updateRequestLog(job.data, done);
});

queue.process('saveToTrash', 2, function(job, done){
    jobs.saveToTrash(job.data, done);
});

queue.process('sendWebhook', 2, function(job,done){
    jobs.sendWebhook(job.data, done);
});

module.exports = queue;

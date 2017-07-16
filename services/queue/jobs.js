"use strict";

var models = require('../../models');
var _ = require('lodash');
var log = require('../logger');

var jobs = {};

// Logs all API requests
jobs.createRequestLog = function(request, done){
    log.info('logging API request: ',request.RequestId);
    models.RequestLogs.create(request)
    .then(function(res){
      return done(false, res);
  })
    .catch(function(err){
      log.error(err);
      return done(new Error(err.message));
  });
};

// Logs all API responses
jobs.updateRequestLog = function(response, done){
    log.info('logging API response: ',response.requestId);
    var requestId = response.requestId;
    delete response.requestId;
    models.RequestLogs.update({RequestId: requestId},response)
    .then(function(res){
        return done(false, res);
    })
    .catch(function(err){
        log.error(err);
        return done(new Error(err.message));
    });
};

// Creates search tags for all db records
jobs.createSearchTags = function(data, done){
    log.info('Creating search index for: ', data._id);
   var model = data.model;
   var update = data.update ? true : false;
   if(data.update){
    delete data.update;
}
delete data.model;
var ourDoc = data;
var split = [];
delete ourDoc._id;
delete ourDoc.createdAt;
delete ourDoc.updatedAt;
delete ourDoc.tags;
for(var n in ourDoc){
    if(typeof ourDoc[n] === 'string'){
        split.push(ourDoc[n].split(' '));
    }
}

var task;
if(update){
    task = models[model].update(data,{ $set: { updatedAt: new Date()}, $addToSet: {tags: {$each: split}} });
}else{
    task = models[model].update(data,{ $set: { tags: split} });
}

task
.then(function(res){
  return done(false, res);
})
.catch(function(err){
  log.error(err);
  return done(new Error(err.message));
});
};

module.exports = jobs;

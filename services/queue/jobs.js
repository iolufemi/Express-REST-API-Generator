'use strict';

var models = require('../../models');
var _ = require('lodash');
var log = require('../logger');
var encryption = require('../encryption');
var crypto = require('crypto');
var request = require('request-promise');
var q = require('q');
var debug = require('debug')('jobs');
var request2 = require('../request');
var queue = require('./');

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
            return done({statusCode: 422 , message: err});
        });
};

// Logs all API responses
jobs.updateRequestLog = function(response, done){
    log.info('logging API response: ',response.requestId);
    var requestId = response.requestId;
    if(response && response.requestId){
        delete response.requestId;
    }
    
    models.RequestLogs.update({RequestId: requestId},response)
        .then(function(res){
            return done(false, res);
        })
        .catch(function(err){
            log.error(err);
            return done({statusCode: 422 , message: err});
        });
};

// Creates search tags for all db records
jobs.createSearchTags = function(data, done){
    log.info('Creating search index for: ', data._id);
    var dataClone = _.extend({},data);
    var model = data.model;
    var isSQL = data.isSQL;

    var update = data.update ? true : false;
    if(dataClone && dataClone.update){
        delete dataClone.update;
    }
    if(dataClone && dataClone.model){
        delete dataClone.model;
    }
    if(dataClone && dataClone.isSQL){
        delete dataClone.isSQL;
    }
    if(dataClone && dataClone.createdAt){
        delete dataClone.createdAt;
    }
    if(dataClone && dataClone.updatedAt){
        delete dataClone.updatedAt;
    }

    var ourDoc = dataClone;
    var split = [];
    
    for(var n in ourDoc){
        if(ourDoc[n] === ourDoc._id){ /* jslint ignore:line */
            // Skip
        }else if(ourDoc[n] === ourDoc.createdAt){ /* jslint ignore:line */
            // Skip
        }else if(ourDoc[n] === ourDoc.updatedAt){ /* jslint ignore:line */
            // Skip
        }else if(ourDoc[n] === ourDoc.tags){ /* jslint ignore:line */
            // Skip
        }else{
            if(typeof ourDoc[n] === 'string'){
                split.push(ourDoc[n].split(' '));
            }else{ /* jslint ignore:line */
            // Move on nothing to see here
            }
        }

    }
    split = _.flattenDeep(split);

    var task;
    if(model){
        if(isSQL){
            task = models[model].update({ tags: split.join(', ')}, {where: dataClone} );
        }else{
            if(update){
                task = models[model].update(dataClone,{ updatedAt: new Date(Date.now()).toISOString(), tags: split});
            }else{
                task = models[model].update(dataClone,{ tags: split});
            }
        }

        task
            .then(function(res){
                return done(false, res);
            })
            .catch(function(err){
                log.error(err);
                return done({statusCode: 422 , message: err});
            });
    }else{
        return done({statusCode: 400 , message: 'No Model Passed!'});
    }

};

// Backup Data to Trash
jobs.saveToTrash = function(data, done){
    if(data.data){
        log.info('Saving '+data.data._id+' to Trash...');
        models.Trash.create(data)
            .then(function(res){
                debug('Finished saving to trash: ', res);
                done(false, res);
            })
            .catch(function(err){
                done({statusCode: 422 , message: err});
            });
    }else{
        done({statusCode: 400 , message: 'No data was passed'});
    }
    
};

// Send Webhook Event
jobs.sendWebhook = function (data, done) {
    log.info('Sending Webhook...');
    request2('webhook', data.reference, data.webhookURL, 'POST', data.data, {
        'content-type': 'application/json'
    })
        .then(function (resp) {
            done(false, resp);
        })
        .catch(function (err) {
            // Retry in 5 minutes time
            queue.create('sendWebhook', data)
                .delay(5 * 60000)
                .save();

            done(err);
        });
};

// Send HTTP Request
// This is for jobs that can be configured from an admin dashboard. So an admin an configure the system to all an api at a particular time daily.
// This can be used within the code too, to do some jobs.
// Supports POST or GET
// Other methods not quaranteed 
jobs.sendHTTPRequest = function(data, done){
    log.info('Sending HTTP ' +data.method+' request to '+data.url+' with data => '+JSON.stringify(data.data)+' and headers => '+JSON.stringify(data.headers));
    // Expected data
    // {
    // url: 'http://string.com',
    // method: 'POST', // or any http method
    // headers: {
    // 'User-Agent': 'Request-Promise'
    // },
    // data: {
    // someData: 'this',
    // someOtherData: 'and this'
    // }
    // }
    // 

    var options = {
        method: data.method,
        uri: data.url,
        body: data.data,
        headers: data.headers,
        json: true // Automatically parses the JSON string in the response
    };

    if(data.method === 'GET'){
        options.qs = data.data;
    }else if(data.method === 'POST'){
        options.body = data.data;
    }else{
        options.qs = data.data;
        options.body = data.data;
    }
    request(options)
        .then(function(resp){
            done(false, resp);
        })
        .catch(function(err){
            done({statusCode: 422 , message: err.message});
        });
};

module.exports = jobs;

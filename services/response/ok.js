"use strict";
var log = require('../logger');
var config = require('../../config');
var encryption = require('../encryption');
var debug = require('debug')('response');
var RequestLogs = require('../../models').RequestLogs;
var _ = require('lodash');
var queue = require('../queue');

module.exports = function(data, cache, extraData){
	debug("sending ok response");
	var req = this.req;
	var res = this;

    // Dump it in the queue
    var response = {};
    if(cache){
        response.response = data;
        response.response.cached = cache;
    }else{
        response.response = {status: 'success', data: data};
    }
    
    if(extraData){
        response.response =  _.extend(response.response, extraData);
    }
    
    response.requestId = req.requestId;

    if(req.get('x-tag') && req.method === 'POST' && config.secureMode && data){
      debug("i want to encrypt");
      var key = req.get('x-tag');
      debug('our encryption key: ', key);
      var text = JSON.stringify(data);
      debug("about to call encryption method");
      encryption.encrypt(text, key)
      .then(function(resp){
         debug("got response from encryption method: ",resp);
         log.info('Sending ok response: ', response.response);
         response.response.secure = true;
         response.response.data = resp.encryptedText;
         response.response.truth = resp.truth;
         res.status(200).json(response.response);
     })
      .catch(function(err){
         debug("got error from encryption method: ", err);
         res.serverError(err,'Error encrypting response.');
     });
  }else{
      log.info('Sending ok response: ', response.response);
      if(data){
            // Only cache GET calls
            if(req.method === 'GET' && config.noFrontendCaching !== 'yes'){

            // If this is a cached response, show response else cache the response and show response.
            if(cache){
                res.status(200).json(response.response);
            }else{
                // req.cacheKey
                req.cache.set(req.cacheKey,response.response)
                .then(function(resp){
                    res.status(200).json(response.response);
                })
                .catch(function(err){
                    log.error('Failed to cache data: ', err);
                    // This error shouldn't stop our response
                    res.status(200).json(response.response);
                });
            }
        }else{
            res.status(200).json(response.response);
        }
    }else{
     res.status(200).json(response.response);
 }
}

queue.create('logResponse', response)
.save();

};

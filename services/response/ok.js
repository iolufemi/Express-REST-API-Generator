"use strict";
var log = require('../logger');
var config = require('../../config');
var encryption = require('../encryption');
var debug = require('debug')('response');
var RequestLogs = require('../../models').RequestLogs;
var _ = require('lodash');
var queue = require('../queue');

module.exports = function(data, cache){
	debug("sending ok response");
	var req = this.req;
	var res = this;

    // Dump it in the queue
    var response = {response: {status: 'success', data: data, cached: cache}};
    response.requestId = req.requestId;
    
    queue.create('logResponse', response)
    .save();

    if(req.get('x-tag') && req.method === 'POST' && config.secureMode && data){
      debug("i want to encrypt");
      var key = req.get('x-tag');
      debug('our encryption key: ', key);
      var text = JSON.stringify(data);
      debug("about to call encryption method");
      encryption.encrypt(text, key)
      .then(function(resp){
       debug("got response from encryption method: ",resp);
       log.info('Sending ok response: ', data);
       res.status(200).json({status: 'success', data: resp, secure: true});
   })
      .catch(function(err){
       debug("got error from encryption method: ", err);
       res.serverError(err,'Error encrypting response.');
   });
  }else{
      log.info('Sending ok response: ', data);
      if(data){
        // Only cache GET calls
        if(req.method === 'GET' && config.noFrontendCaching !== 'yes'){

            // If this is a cached response, show response else cache the response and show response.
            if(cache){
                res.status(200).json({status: 'success', data: data, cached: true});
            }else{
                // req.cacheKey
                req.cache.set(req.cacheKey,data)
                .then(function(resp){
                    res.status(200).json({status: 'success', data: data});
                })
                .catch(function(err){
                    log.error('Failed to cache data: ', err);
                // This error shouldn't stop our response
                res.status(200).json({status: 'success', data: data});
            });
            }
        }else{
            res.status(200).json({status: 'success', data: data});
        }
    }else{
       res.status(200).json({status: 'success'});
   }
}
};

"use strict";
var log = require('../logger');
var config = require('../../config');
var encryption = require('../encryption');
var debug = require('debug')('response');
var RequestLogs = require('../../models/RequestLogs');
var _ = require('lodash');

module.exports = function(data, cache){
	debug("sending ok response");
	var req = this.req;
	var res = this;
    // ToDo: Move this to a queue. Not good for performance
    RequestLogs.update({RequestId: req.requestId},{response: {status: 'success', data: data, cached: cache}})
    .then(function(res){
        return _.identity(res);
    })
    .catch(function(err){
        log.error(err);
    });

    

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
        if(req.method === 'GET'){

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

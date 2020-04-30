'use strict';
var request = require('request-promise');
var Model = require('./Model');
var q = require('q');
var log = require('../logger');

module.exports = function(service, requestId, uri, method, data, headers){
    // have you made this request before?
    // if yes, return the response from the previous request
    // else make request
    // log the response, the response code and updated at
    // end
    
    var options = {
        method: method,
        uri: uri,
        data: data,
        headers: headers,
        insecure: true
    };

    var existss;
    return q.Promise(function(resolve, reject){
        Model.findOne({RequestId: requestId, service: service})
            .then(function(resp){
                existss = resp;
                if(!resp){
                    options.RequestId = requestId;
                    options.service = service;
                    return Model.create(options);
                }else if(resp.response && resp.responseStatusCode === 200){
                    throw {RequestId: resp.RequestId, response: resp.response};
                }else{
                    options.retriedAt = Date.now();
                    return Model.findByIdAndUpdate(resp._id, options);
                }
            })
            .then(function(resp){
                existss = true;
                options.json = true;
                if(options.method === 'GET'){
                    options.qs = options.data;
                }else if(options.method === 'POST'){
                    options.body = options.data;
                }else{
                    options.qs = options.data;
                    options.body = options.data;
                }

                options.data = null;
                options.RequestId = null;
                options.service = null;
                options.retriedAt = null;
                return request(options);
            })
            .then(function(resp){
                return [Model.update({RequestId: requestId, service: service}, {response: resp, responseStatusCode: 200, updatedAt: Date.now()}), resp];
            })
            .spread(function(update, resp){
                return resolve(resp);
            })
            .catch(function(err){
                if(err.RequestId){
                    return resolve(err.response);
                }else{
                    var updateddd;
                    if(existss){
                        updateddd = Model.update({RequestId: requestId, service: service}, {response: (err.response && err.response.body) ? err.response.body : { type: 'internal error', message: err.message}, responseStatusCode: err.statusCode ? err.statusCode : 500, updatedAt: Date.now()});
                    }else{
                        options.RequestId = requestId;
                        options.service = service;
                        options.response = (err.response && err.response.body) ? err.response.body : {type: 'internal error', message: err.message};
                        options.responseStatusCode = err.statusCode ? err.statusCode : 500;
                        options.updatedAt = Date.now();
                        updateddd = Model.create(options);
                    }
                
                    updateddd
                        .then(function(resp){
                            return reject((err.response && err.response.body) ? err.response.body : {type: 'internal error', message: err.message});
                        })
                        .catch(function(err2){
                            log.error('Error while trying to update API request: ',err2);
                            return reject((err.response && err.response.body) ? err.response.body : {type: 'internal error', message: err.message});
                        });
                }
            });
    });
};
// ToDo: Test request module
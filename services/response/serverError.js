"use strict";
var log = require('../logger');
var RequestLogs = require('../../models').RequestLogs;
var _ = require('lodash');
var queue = require('../queue');

module.exports = function(data, message){
	log.error('sending server error response: ', data, message || 'server error');

    var req = this.req;
    var res = this;

    // Dump it in the queue
    var response = {response: {status: 'error', data: data, message: message ? message : 'server error'}};
    response.requestId = req.requestId;
    queue.create('logResponse', response)
    .save();

    if (data !== undefined && data !== null) {
      if(Object.keys(data).length === 0 && JSON.stringify(data) === JSON.stringify({})){
         data = data.toString();
     }
 }
 var statusCode;
 if(data.statusCode){
    statusCode = data.statusCode;
}else{
    statusCode = 500;
}

if(data){
  this.status(statusCode).json({status: 'error', data: data, message: message ? message : 'server error'});
}else{
  this.status(statusCode).json({status: 'error', message: message ? message : 'server error'});
}
};

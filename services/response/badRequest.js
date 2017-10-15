"use strict";
var log = require('../logger'); 
var _ = require('lodash');
var queue = require('../queue');

module.exports = function(data, message){
	log.warn('Sending bad request response: ', data, message || 'bad request');
    var req = this.req;
    var res = this;

    // Dump it in the queue
    var response = {response: {status: 'error', data: data, message: message ? message : 'bad request'}};
    response.requestId = req.requestId;
    
    queue.create('logResponse', response)
    .save();

    if (data !== undefined && data !== null) {
      if(Object.keys(data).length === 0 && JSON.stringify(data) === JSON.stringify({})){
       data = data.toString();
   }
}

if(data){
  this.status(400).json({status: 'error', data: data, message: message ? message : 'bad request'});
}else{
  this.status(400).json({status: 'error', message: message ? message : 'bad request'});
}
};

"use strict";
var log = require('../logger');
var RequestLogs = require('../../models/RequestLogs');
var _ = require('lodash');

module.exports = function(data, message){
	log.warn('Sending forbidden response: ', data, message || 'forbidden');
    var req = this.req;
    var res = this;
    // ToDo: Move this to a queue. Not good for performance
    RequestLogs.update({RequestId: req.requestId},{response: {status: 'error', data: data, message: message ? message : 'forbidden'}})
    .then(function(res){
        return _.identity(res);
    })
    .catch(function(err){
        log.error(err);
    });

	if (data !== undefined && data !== null) {
		if(Object.keys(data).length === 0 && JSON.stringify(data) === JSON.stringify({})){
			data = data.toString();
		}
	}
	
	if(data){
		this.status(503).json({status: 'error', data: data, message: message ? message : 'forbidden'});
	}else{
		this.status(503).json({status: 'error', message: message ? message : 'forbidden'});
	}
};

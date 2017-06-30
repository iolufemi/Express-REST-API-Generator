"use strict";
var log = require('../logger');
var RequestLogs = require('../../models/RequestLogs');
var _ = require('lodash');

module.exports = function(data, message){
	log.error('sending server error response: ', data, message || 'server error');

    var req = this.req;
    var res = this;

    RequestLogs.update({RequestId: req.requestId},{response: {status: 'error', data: data, message: message ? message : 'server error'}})
    .then(function(res){
        return _.identity(res);
    });

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

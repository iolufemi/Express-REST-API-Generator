"use strict";
var log = require('../logger');

module.exports = function(data, message){
	log.error('sending server error response: ', data, message || 'server error');

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

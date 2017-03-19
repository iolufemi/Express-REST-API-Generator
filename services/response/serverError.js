"use strict";
var log = require('../logger');

module.exports = function(data, message){
	log.error('sending server error response: ', data, message || 'server error');

	if (data !== undefined && data !== null) {
		if(Object.keys(data).length === 0 && JSON.stringify(data) === JSON.stringify({})){
			data = data.toString();
		}
	}

	if(data){
		this.status(500).json({status: 'error', data: data, message: message ? message : 'server error'});
	}else{
		this.status(500).json({status: 'error', message: message ? message : 'server error'});
	}
};

"use strict";
var log = require('winston');
var config = require('../../config');
var response = require('../response');
var bugsnag = require('bugsnag');
var winstonBugsnag = require('winston-bugsnag');

if(config.env === 'production'){
	if(!config.bugsnagKey){
		log.add(log.transports.File, { filename: 'app-'+new Date().toDateString().split(' ').join('_')+'.log', level: 'warn'});
		log.remove(log.transports.Console);
	}else{
		bugsnag.register(config.bugsnagKey);
		log.add(log.transports.File, { filename: 'app-'+new Date().toDateString().split(' ').join('_')+'.log', level: 'warn'});
		log.add(winstonBugsnag,{level: 'warn'});
		log.remove(log.transports.Console);
	}
}

module.exports = log;
module.exports.errorHandler = function(err, req, res, next){ // jshint ignore:line
	response(req, res, next);
	log.error(err);
	if(err.statusCode === 404){
		res.notFound(err);
	}else if(err.statusCode === 401){
		res.unauthorized(err);
	}else if(err.statusCode === 400){
		res.badRequest(err);
	}else if(err.statusCode === 503){
		res.forbidden(err);
	}else{
		res.serverError(err);
	}
};
// ToDo: Test Error Handler

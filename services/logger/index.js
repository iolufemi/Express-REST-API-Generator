"use strict";
var log = require('winston');
var config = require('../../config');
var response = require('../response');
var bugsnag = require('bugsnag');
var winstonBugsnag = require('winston-bugsnag');
var winstonLoggly = require('winston-loggly-bulk');

if(config.env === 'production'){
    if(!config.bugsnagKey && !config.logglyToken){
        log.add(log.transports.File, { filename: 'app-'+new Date().toDateString().split(' ').join('_')+'.log', level: 'warn'});
        log.remove(log.transports.Console);
    }else{
        if(config.bugsnagKey){
            bugsnag.register(config.bugsnagKey);
            log.add(winstonBugsnag,{level: 'warn'});
        }
        if(config.logglyToken){
            log.add(log.transports.Loggly, {
                token: config.logglyToken,
                subdomain: config.logglySubdomain,
                tags: [config.logglyTag],
                json: true,
                level: 'warn'
            });
        }
        log.add(log.transports.File, { filename: 'app-'+new Date().toDateString().split(' ').join('_')+'.log', level: 'warn'});
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

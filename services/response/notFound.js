"use strict";
var log = require('../logger');
var RequestLogs = require('../../models/RequestLogs');
var _ = require('lodash');

module.exports = function(){
	log.warn('Sending 404 response: '+'not found');
    var req = this.req;
    var res = this;

    RequestLogs.update({RequestId: req.requestId},{response: {status: 'error', message: 'not found'}})
    .then(function(res){
        return _.identity(res);
    });

	this.status(404).json({status: 'error', message: 'not found'});
};

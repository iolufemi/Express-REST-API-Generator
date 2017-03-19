"use strict";
var _ = require('lodash');

module.exports = function(req, res, next){
	var responseTypes = {
		ok: require('./ok'),
		badRequest: require('./badRequest'),
		forbidden: require('./forbidden'),
		notFound: require('./notFound'),
		serverError: require('./serverError'),
		unauthorized: require('./unauthorized')
	};

	res = _.extend(res, responseTypes);
	next();
};

"use strict";
module.exports = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	trustProxy: process.env.TRUST_PROXY || 'no',
	bugsnagKey: process.env.BUGSNAG_KEY || false,
	secureMode: process.env.SECURE_MODE || false
};
"use strict";
module.exports = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8080,
	trustProxy: process.env.TRUST_PROXY || 'no',
	bugsnagKey: process.env.BUGSNAG_KEY || false,
	secureMode: process.env.SECURE_MODE || false,
	secret: process.env.SECRET || 'lakikihdgdfdjjjdgd67264664vdjhjdyncmxuei8336%%^#%gdvdhj????jjhdghduue',
	mongoURL: process.env.MONGOLAB_URL || 'mongodb://192.168.99.100/snipe'
};
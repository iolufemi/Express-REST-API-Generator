"use strict";
module.exports = {
	env: process.env.NODE_ENV || 'production',
	port: process.env.PORT || 80,
	trustProxy: process.env.TRUST_PROXY || 'no',
	bugsnagKey: process.env.BUGSNAG_KEY || false,
	secureMode: process.env.SECURE_MODE || true,
	secret: process.env.SECRET || 'lakikihdgdfdjjjdgd67264660okjnbgtrdxswerfgytg373745ei8336%%^#%gdvdhj????jjhdghduue',
	mongoURL: process.env.MONGOLAB_URL || 'mongodb://192.168.99.100/snipe'
};
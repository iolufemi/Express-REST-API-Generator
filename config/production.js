"use strict";
module.exports = {
	env: process.env.NODE_ENV || 'production',
	port: process.env.PORT || 80,
	trustProxy: process.env.TRUST_PROXY || 'no',
	bugsnagKey: process.env.BUGSNAG_KEY || false,
	secureMode: process.env.SECURE_MODE || true,
	secret: process.env.SECRET || 'lakikihdgdfdjjjdgd67264660okjnbgtrdxswerfgytg373745ei8336%%^#%gdvdhj????jjhdghduue',
	mongoURL: process.env.MONGOLAB_URL || 'mongodb://192.168.99.100/snipe',
    noFrontendCaching: process.env.NO_CACHE || 'yes',
    rateLimit: process.env.RATE_LIMIT || '180',
    rateLimitExpiry: process.env.RATE_LIMIT_EXPIRY || '3600000',
    redisURL: process.env.REDIS_URL || 'redis://192.168.99.100:6379/1',
    userVerificationEndpoint: process.env.USER_VERIFICATION_API || 'http://mockbin.org/bin/9edd4bf7-bb36-47b6-adb2-54d7a7236e80',
    appVerificationEndpoint: process.env.APP_VERIFICATION_API || 'http://mockbin.org/bin/9edd4bf7-bb36-47b6-adb2-54d7a7236e80',
    letsencryptSSLVerificationURL: process.env.LETSENCRYPT_VERIFICATION_URL || '/.well-known/acme-challenge/xvArhQBSilF4V30dGUagNAZ96ASipB0b0ex0kXn0za8',
    letsencryptSSLVerificationBody: process.env.LETSENCRYPT_VERIFICATION_BODY || 'xvArhQBSilF4V30dGUagNAZ96ASipB0b0ex0kXn0za8._v6aFbaRYWeOmSebtlD-X4Ixf5tPsyULMsXM8HjsK-Q',
    maxContentLength: process.env.MAX_CONTENT_LENGTH || '9999',
    enforceSSL: process.env.ENFORCE_SSL || 'no'
};

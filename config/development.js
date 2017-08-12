"use strict";
module.exports = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8080,
	trustProxy: process.env.TRUST_PROXY || 'no',
	bugsnagKey: process.env.BUGSNAG_KEY || false,
	secureMode: process.env.SECURE_MODE || false,
	secret: process.env.SECRET || 'lakikihdgdfdjjjdgd67264664vdjhjdyncmxuei8336%%^#%gdvdhj????jjhdghduue',
	mongoURL: process.env.MONGOLAB_URL || 'mongodb://192.168.99.100/snipe',
    noFrontendCaching: process.env.NO_CACHE || 'yes',
    frontendCacheExpiry: process.env.FRONTEND_CACHE_EXPIRY || '90',
    backendCacheExpiry: process.env.BACKEND_CACHE_EXPIRY || '90',
    rateLimit: process.env.RATE_LIMIT || '1800',
    rateLimitExpiry: process.env.RATE_LIMIT_EXPIRY || '3600000',
    redisURL: process.env.REDIS_URL || 'redis://192.168.99.100:6379/1',
    letsencryptSSLVerificationURL: process.env.LETSENCRYPT_VERIFICATION_URL || '/.well-known/acme-challenge/xvArhQBSilF4V30dGUagNAZ96ASipB0b0ex0kXn0za8',
    letsencryptSSLVerificationBody: process.env.LETSENCRYPT_VERIFICATION_BODY || 'xvArhQBSilF4V30dGUagNAZ96ASipB0b0ex0kXn0za8._v6aFbaRYWeOmSebtlD-X4Ixf5tPsyULMsXM8HjsK-Q',
    maxContentLength: process.env.MAX_CONTENT_LENGTH || '9999',
    enforceSSL: process.env.ENFORCE_SSL || 'no',
    gitOAuthToken: process.env.GIT_OAUTH_TOKEN || 'b5c90047c21b74b9dc0dbf90c2552cc5e419b9a2',
    queueUIUsername: process.env.QUEUE_UI_USERNAME || 'admin',
    queueUIPassword: process.env.QUEUE_UI_PASSWORD || 'password123/',
    queueUIPort: process.env.QUEUE_UI_PORT || 3000
};

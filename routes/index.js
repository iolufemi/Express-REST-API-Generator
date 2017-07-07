"use strict";
var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var response = require('../services/response');
var encryption = require('../services/encryption');
var log = require('../services/logger');
var me = require('../package.json');
var initialize = require('./initialize');
var config = require('../config');
var helmet = require('helmet');
var client = require('redis').createClient(config.redisURL);
var limiter = require('express-limiter')(router, client);
var _ = require('lodash');
var bodyParser = require('body-parser');
var cors = require('cors');
var hpp = require('hpp');
var contentLength = require('express-content-length-validator');
var MAX_CONTENT_LENGTH_ACCEPTED = config.maxContentLength * 1;
var url = require('url');
var fnv = require('fnv-plus');
var RequestLogs = require('../models/RequestLogs');

router._sanitizeRequestUrl = function(req) {
  var requestUrl = url.format({
    protocol: req.protocol,
    host: req.hostname,
    pathname: req.originalUrl || req.url,
    query: req.query
});

  return requestUrl.replace(/(password=).*?(&|$)/ig, '$1<hidden>$2');
};

router._allRequestData = function(req,res,next){
    var requestData = {};
    req.param = function(key, defaultValue){
        var newRequestData = _.assignIn(requestData, req.params, req.body, req.query);
        if(newRequestData[key]){
            return newRequestData[key];
        }else if(defaultValue){
            return defaultValue;
        }else{
            return false;
        }
    };
    next();
};

router._enforceUserIdAndAppId = function(req,res,next){
    var userId = req.param('userId');
    var appId = req.param('appId');
    if(!userId){
        res.badRequest(false,'No userId parameter was passed in the payload of this request. Please pass a userId.');
    }else if(!appId){
        res.badRequest(false,'No appId parameter was passed in the payload of this request. Please pass an appId.');
    }else{
        req.userId = userId;
        req.appId = appId;
        next();
    }
};

// Log requests here
router.use(function(req,res,next){
  var ipAddress = req.ip;
  req.requestId = fnv.hash(new Date().valueOf() + ipAddress, 128).str();

  var reqLog = {
    RequestId: req.requestId,
    ipAddress: ipAddress,
    url: router._sanitizeRequestUrl(req),
    method: req.method,
    body: _.omit(req.body, ['password','cardno']),
    app: req.appId,
    user: req.userId,
    device: req.get('user-agent'),
    createdAt: new Date()
};
// ToDo: Move this to a queue. Not good for performance
RequestLogs.create(reqLog)
.then(function(res){
    return _.identity(res);
})
.catch(function(err){
  log.error(err);
});

  // persist RequestLog entry in the background; continue immediately

  log.info(reqLog);
  next();
});

router.use(helmet());
// no client side caching
if(config.noFrontendCaching === 'yes'){
    router.use(helmet.noCache());
}
router.use(cors());
router.options('*', cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.raw());
router.use(bodyParser.text());
router.use(encryption.interpreter);
router.use(hpp());
router.use(contentLength.validateMax({max: MAX_CONTENT_LENGTH_ACCEPTED, status: 400, message: "Stop! Maximum content length exceeded."})); // max size accepted for the content-length
// add the param function to request object
router.use(router._allRequestData);

// API Rate limiter
limiter({
  path: '*',
  method: 'all',
  lookup: ['ip','userId','appId'],
  total: config.rateLimit * 1,
  expire: config.rateLimitExpiry * 1,
  onRateLimited: function (req, res, next) {
    next({ message: 'Rate limit exceeded', statusCode: 429 });
}
});

router.use(response);
router.use(expressValidator());

router.get('/', function (req, res) {
    res.ok({name: me.name, version: me.version});
});

// Let's Encrypt Setup
router.get(config.letsencryptSSLVerificationURL, function(req,res){
    res.send(config.letsencryptSSLVerificationBody);
});

router.use('/', initialize);

// Publicly available routes here
// 
// 


// Make userId compolsory in every request
router.use(router._enforceUserIdAndAppId);

// Other routes here
// 
// 

router.use(function(req, res, next) { // jshint ignore:line
    res.notFound();
});

router.use(log.errorHandler);

module.exports = router;

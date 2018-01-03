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
var redisClient = require('../services/database').redis;
var limiter = require('express-limiter')(router, redisClient);
var _ = require('lodash');
var bodyParser = require('body-parser');
var cors = require('cors');
var hpp = require('hpp');
var contentLength = require('express-content-length-validator');
var MAX_CONTENT_LENGTH_ACCEPTED = config.maxContentLength * 1;
var url = require('url');
var fnv = require('fnv-plus');
var RequestLogs = require('../models').RequestLogs;
var Cacheman = require('cacheman');
var EngineRedis = require('cacheman-redis');
var queue = require('../services/queue');
var fileSystem = require("fs");

// load routes. Comes with versioning. unversioned routes should be named like 'user.js'
// versioned files or routes should be named as user.v1.js. 
// The versioned routes will be available at /v1/routename or as the route version reads
// The latest version will also be loaded on the default route /routename
router._loadRoutes = function(routeFiles){
    var versions = [];
    var ourRoutes = {};
    // Number of routes, removing index and initialize
    var currentRoute = 0;
    var routeNum = routeFiles.length * 1;

    // Comes with endpoint versioning 
    routeFiles.forEach(function(file) {
        currentRoute = currentRoute + 1;
        var splitFileName = file.split('.');
        if(splitFileName[0] !== 'index' && splitFileName[0] !== 'initialize'){

            if(splitFileName.length === 3){
                ourRoutes[splitFileName[0]+'.'+splitFileName[1]] = require('./'+splitFileName[0]+'.'+splitFileName[1]);
                router.use('/'+splitFileName[1], ourRoutes[splitFileName[0]+'.'+splitFileName[1]]);
                var splitVersion = splitFileName[1].split('v');
                var versionMap = {};
                versionMap[splitFileName[0]] = splitVersion[1];
                versions.push(versionMap);
            }else{
                ourRoutes[splitFileName[0]] = require('./'+splitFileName[0]+'.'+splitFileName[1]);
                router.use('/', ourRoutes[splitFileName[0]]);
            }

        }
        if(currentRoute === routeNum){
            var finalVersions = {};
            _.forEach(versions, function(value){
                _.forOwn(value, function(value, key){
                    if(_.has(finalVersions, key)){
                        finalVersions[key].push(value);
                    }else{
                        finalVersions[key] = [];
                        finalVersions[key].push(value);
                    }
                });   
            });
            _.forOwn(finalVersions, function(value, key){
                var sorted = value.sort();
                var sortedlength = sorted.length * 1;
                router.use('/', ourRoutes[key+'.v'+sortedlength]);
            });
        } 
    });
return ourRoutes;
};

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
  var developer = req.param('developer');
  // The routes after this line will require userid, appid and developer.
  if(config.enforceUserIdAppIdDeveloperId === 'yes' || req.test){
    // Make userId compolsory in every request
    if(!userId){
        return res.badRequest(false,'No userId parameter was passed in the payload of this request. Please pass a userId.');
    }else if(!appId){
        return res.badRequest(false,'No appId parameter was passed in the payload of this request. Please pass an appId.');
    }else if(!developer){
        return res.badRequest(false,'No developer parameter was passed in the payload of this request. Please pass a developer id.');
    }else{
        req.userId = userId;
        req.appId = appId;
        req.developer = developer;
        if(req.body){
            if(req.body && req.body.length){
              req.body = _.map(req.body,function(value){
                value.client = appId;
                value.owner = userId;
                value.createdBy = userId;
                value.developer = developer;
                return value;
            });
              next();
          }else{
              req.body.client = appId;
              req.body.owner = userId;
              req.body.createdBy = userId;
              req.body.developer = developer;
              next();
          }
      } 
  }
}else{
    next();
}
};

router._APICache = function(req,res,next){
  var cache = new EngineRedis(redisClient);
  var APICache = new Cacheman(me.name, {engine: cache, ttl: config.backendCacheExpiry});
  req.cache = APICache;
  // Tell Frontend to Cache responses
  res.set({'Cache-Control':'private, max-age='+config.frontendCacheExpiry+''});

  var key = [];
  key.push(req.url);
  key.push(req.ip);
  key.push(req.get('user-agent'));
  if(req.userId){
    key.push(req.userId);
}
if(req.appId){
    key.push(req.appId);
}
req.cacheKey = key;
  // Remember to delete cache when you get a POST call
  // Only cache GET calls
  if(req.method === 'GET'){
    //  if record is not in cache, set cache else get cache
    req.cache.get(req.cacheKey)
    .then(function(resp){
      if(!resp){
        // Will be set on successful response
        next();
    }else{
        res.ok(resp, true);
    }
})
    .catch(function(err){
      log.error('Failed to get cached data: ', err);
      // Don't block the call because of this failure.
      next();
  });
}else{
    if(req.method === 'POST' || req.method === 'PUT' || req.method === 'PUSH'){
      req.cache.del(req.cacheKey)
      .then(function(res){})
      .catch(function(err){
        log.error('Failed to delete cached data: ', err);
          // Don't block the call because of this failure.
      }); // No delays
  }
  next();
}

};

// Log requests here
router.use(function(req,res,next){
  var ipAddress = req.ip;
  req.requestId = fnv.hash(new Date().valueOf() + ipAddress, 128).str();
  res.set('X-Request-Id',req.requestId);

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

// Dump it in the queue
queue.create('logRequest', reqLog)
.save();


  // persist RequestLog entry in the background; continue immediately

  log.info(reqLog);
  next();
});

router.use(helmet());
router.use(cors());
router.options('*', cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.raw());
router.use(bodyParser.text());
// load response handlers
router.use(response);
// Watch for encrypted requests
router.use(encryption.interpreter);
router.use(hpp());
router.use(contentLength.validateMax({max: MAX_CONTENT_LENGTH_ACCEPTED, status: 400, message: "Stop! Maximum content length exceeded."})); // max size accepted for the content-length
// add the param function to request object
router.use(router._allRequestData);

// API Rate limiter
limiter({
  path: '*',
  method: 'all',
  lookup: ['ip','userId','appId','developer'],
  total: config.rateLimit * 1,
  expire: config.rateLimitExpiry * 1,
  onRateLimited: function (req, res, next) {
    next({ message: 'Rate limit exceeded', statusCode: 429 });
}
});


router.use(expressValidator());

// no client side caching
if(config.noFrontendCaching === 'yes'){
  router.use(helmet.noCache());
}else{
   router.use(router._APICache);
}

router.get('/', function (req, res) {
  res.ok({name: me.name, version: me.version});
});

// Let's Encrypt Setup
router.get(config.letsencryptSSLVerificationURL, function(req,res){
  res.send(config.letsencryptSSLVerificationBody);
});



// Publicly available routes here, IE. routes that should work with out requiring userid, appid and developer.
router.use('/', initialize);

router.use(router._enforceUserIdAndAppId);

// Should automatically load routes
// Other routes here

var normalizedPath = require("path").join(__dirname, "./");
var routeFiles = fileSystem.readdirSync(normalizedPath);

router._loadRoutes(routeFiles);

// Finished loading routes

router.use(function(req, res, next) { // jshint ignore:line
  res.notFound();
});

router.use(log.errorHandler);

module.exports = router;

// ToDo: Test API versioning
// ToDo: Test rate limiting
// ToDo: Test complete route Loader test
// ToDo: Test _sanitizeRequestUrl middleware function
// ToDo: Test _allRequestData middleware function for default value scenario
// ToDo: Test _enforceUserIdAndAppId middle function for when req.body is an array
// ToDo: Make Log requests testable and write unit tests for it
// ToDo: Develop the route loader into a separate node module to be publish on npm 
// ToDo: Develop all services onto separate node module to be publish on npm 

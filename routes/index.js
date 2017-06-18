"use strict";
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cors = require('cors');
var response = require('../services/response');
var encryption = require('../services/encryption');
var log = require('../services/logger');
var me = require('../package.json');
var initialize = require('./initialize');
var _ = require('lodash');

var allRequestData = function(req,res,next){
    var requestData = {};
    var newRequestData = _.assignIn(requestData, req.params, req.body, req.query);
    req.param = function(key, defaultValue){
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

var enforceUserId = function(req,res,next){
    var userId = req.param('userId');
    if(!userId){
        res.badRequest(false,'No userId parameter was passed in the payload of this request. Please pass a userId.');
    }else{
        // Do a middleware that validates userId here. put the user service endpoint in the env var. ideally, this should be the gateway endpoint
        next();
    }
};


router.use(cors());
router.use(response);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.raw());
router.use(bodyParser.text());
// add the param function to request object
router.use(allRequestData);
// Make userId compolsory in every request
router.use(enforceUserId);
router.use(encryption.interpreter);
router.use(expressValidator());

router.use(function(req,res,next){
    log.info('[TIME: '+new Date().toISOString()+'] [IP Address: '+req.ip+'] [METHOD: '+req.method+'] [URL: '+req.originalUrl+']');
    next();
});

router.options('*', cors());

router.get('/', function (req, res) {
    res.ok({name: me.name, version: me.version});
});

router.get('/.well-known/acme-challenge/xvArhQBSilF4V30dGUagNAZ96ASipB0b0ex0kXn0za8', function(req,res){
    res.send('xvArhQBSilF4V30dGUagNAZ96ASipB0b0ex0kXn0za8._v6aFbaRYWeOmSebtlD-X4Ixf5tPsyULMsXM8HjsK-Q');
});

// Other routes here

router.use('/', initialize);

router.use(function(req, res, next) { // jshint ignore:line
    res.notFound();
});

router.use(log.errorHandler);

module.exports = router;

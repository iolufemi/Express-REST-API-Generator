'use strict';

process.env.SECURE_MODE = true;

var chai = require('chai');
chai.should();
var config = require('../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var crypto = require('crypto');

// init

var res = {};
var req = {};
var demoData = '{"el escribimos": "silencio es dorado"}';
var demoDataHash = crypto.createHash('sha512')
	        .update(demoData)
	        .digest('hex');
	        
	        console.log('hash', demoDataHash);
	    var nextChecker = false;    
        var next = function(){
            if(arguments.length > 0){
                console.log(arguments[0]);
            }else{
                nextChecker = true;
            }
            
            return nextChecker;
        };
    res.json = function(data){
        return res;
    };
    
    res.status = function(status){
        return res;
    };
    
    var header = {};
    res.set = function(key, value){
        header[key] = value;
        return header[key];
    };
    req.header = function(key){
        return header[key];
    };
    
    header.set = function(data){
        header.temp = data;
        return header.temp;
    };
    
    req.method = '';

// Testing the logger service

var logger = require('../services/logger');
describe('#Logger service test', function(){
    it('should return an object', function(done){
        logger.should.be.an('object');
        done();
    });
    
    it('should have property warn, error, info, verbose, debug, silly and log', function(done){
        logger.should.be.have.property('warn');
        logger.should.be.have.property('error');
        logger.should.be.have.property('info');
        logger.should.be.have.property('log');
        logger.should.be.have.property('verbose');
        logger.should.be.have.property('debug');
        logger.should.be.have.property('silly');
        done();
    });
});

// Testing response service

var response = require('../services/response');
describe('#Response service test', function(){
    it('should add property ok, badRequest, forbidden, notFound, serverError and unauthorized to res object', function(done){
        response(req,res,next);
        nextChecker = false; 
        res.should.have.property('ok');
        res.should.have.property('badRequest');
        res.should.have.property('forbidden');
        res.should.have.property('notFound');
        res.should.have.property('serverError');
        res.should.have.property('unauthorized');
        done();
    });
});

// Testing encryption service

var encryption = require('../services/encryption');

describe('#Encryption service test', function(){
    it('should have property generateKey, encrypt, decrypt and interpreter', function(done){
        
        encryption.should.have.property('generateKey');
        encryption.should.have.property('encrypt');
        encryption.should.have.property('decrypt');
        encryption.should.have.property('interpreter');
        done();
    });
    
    
    it('should generate key', function(done){
        encryption.generateKey().should.eventually.be.a('string').notify(done);
    });

    it('should encrypt and decrypt data', function(done){
        encryption.generateKey()
        .then(function(resp){
            header['x-tag'] = resp;
            
            return encryption.encrypt(demoData, req.header('x-tag'));
        })
        .then(function(resp){
            console.log("encrypted data: ", resp);
            res.set('encryptedData', resp);
            return encryption.decrypt(resp, req.header('x-tag'), demoDataHash);
        })
        .then(function(resp){
            console.log("decrypted data: ", resp);
            resp.should.be.a('string');
            done();
        })
        .catch(function(err){
            done(err);
        });
    });
    
    it('should detect compromised data', function(done){
        encryption.decrypt('5b9f535be7edbad69ac03aced46f6586c1b2d', req.header('x-tag'), demoDataHash)
        .then(function(resp){
            done(resp);
        })
        .catch(function(err){
            if(err.message === 'Data integrity compromised!'){
                done();
            }else{
                done(err);
            }
        });
    });
    
    it('should interpret data when data is not POST', function(done){
        encryption.interpreter(req,res,next);
        nextChecker.should.be.true; /* jslint ignore:line */
        nextChecker = false;
        done();
    });
    
    it('should interpret data when data is POST', function(done){
        req.method = 'POST';
        req.body = {};
        req.body.secureData = req.header('encryptedData');
        req.body.truth = demoDataHash;
        encryption.interpreter(req,res,next);
        setTimeout(function(){
            nextChecker.should.be.true; /* jslint ignore:line */
            nextChecker = false;
        },1000);
        done();
    });
});

// Testing validation service

var validator = require('../services/validator');

describe('#Validation service test', function(){
    it('should exist as a function',function(done){
        validator.should.exist; /* jslint ignore:line */
        done();
    });
});

// Testing database service

var db = require('../services/database/mongo');

describe('#Database service test', function(){
    it('should exist as a function',function(done){
        db.should.exist; /* jslint ignore:line */
        done();
    });
});

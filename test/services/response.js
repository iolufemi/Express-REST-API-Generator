'use strict';

process.env.SECURE_MODE = true;

var chai = require('chai');
chai.should();
var config = require('../../config');
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
req.get = function(key){
    return header[key];
};

header.set = function(data){
    header.temp = data;
    return header.temp;
};

req.method = '';

// Testing response service

var response = require('../../services/response');
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

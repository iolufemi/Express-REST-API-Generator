'use strict';

process.env.SECURE_MODE = true;

var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var crypto = require('crypto');
var express = require('express');
var app = express();
var request = require('supertest');
var response = require('../../services/response');
var bodyParser = require('body-parser');

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

// Testing validation service

var validator = require('../../services/validator');

// Dummy App
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(response);

app.post('/', function(req,res,next){
    req._required = [
        'name',
        'name2'
    ];

    next();
},
validator,
function(req,res){
    res.ok('It worked!');
}
);

var agent = request(app);

describe('#Validation service test', function(){
    it('should exist as a function',function(done){
        validator.should.exist; /* jslint ignore:line */
        done();
    });

    it('should fail due to non existence of a required parameter',function(done){
        agent
            .post('/')
            .send({name:'femi'})
            .expect(400,done);
    });

    it('should be successful', function(done){
        agent
            .post('/')
            .send({name:'femi2',name2:'femi'})
            .expect(200,done);
    });
});

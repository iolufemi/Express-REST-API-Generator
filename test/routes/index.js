'use strict';

process.env.RATE_LIMIT = 10;
var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var request = require('supertest');
var router = require('../../routes');
var express = require('express');

var app = express();
app.use('/',router);

// init

// var res = {};
// var req = {};

// var nextChecker = false;    
// var next = function(){
//     if(arguments.length > 0){
//         console.log(arguments[0]);
//     }else{
//         nextChecker = true;
//     }

//     return nextChecker;
// };
// res.json = function(data){
//     return res;
// };

// res.status = function(status){
//     return res;
// };

// var header = {};
// res.set = function(key, value){
//     header[key] = value;
//     return header[key];
// };
// req.get = function(key){
//     return header[key];
// };

// header.set = function(data){
//     header.temp = data;
//     return header.temp;
// };

// req.method = '';

var agent = request.agent('http://0.0.0.0:'+config.port+'');

describe('Test rate limiting', function(){

    it('should reach request rate limit', function(done){
        agent
        .get('/initialize')
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize');
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            return agent
            .get('/initialize')
            .expect(429);
        })
        .then(function(res){
            console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
            done();
        })
        .catch(function(err){
            done(err);
        });
    });
});

// test rate limiting
// Test that the request limit error is logged on the DB
// Test allRequestData middleware
// Test enforceUserId middleware

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

var agent = request.agent(app);

describe('Test rate limiting', function(){

    it('should reach request rate limit', function(done){
        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*1);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*2);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*3);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*4);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*5);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*6);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*7);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*8);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*9);

        setTimeout(function(){ /* jslint ignore:line */
            agent
            .get('/initialize')
            .end(function(err, res){
                if(err){
                    return console.error(err);
                }
                console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining']);
            });
        },1000*10);

        setTimeout(function(){
            agent
            .get('/initialize')
            .expect(429)
            .end(function(err, res){
                if(err){
                    done(err);
                }else{
                    console.log('Limit: ', res.headers['x-ratelimit-limit'], '| Remaining: ', res.headers['x-ratelimit-remaining'], ' | Body: ', res.body);
                    done();
                }
            });
        },1000*11);

    });
});

// test rate limiting
// Test that the request limit error is logged on the DB
// Test allRequestData middleware
// Test enforceUserId middleware

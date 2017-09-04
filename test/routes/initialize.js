'use strict';
var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var request = require('supertest');
var express = require('express');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);


var response = require('../../services/response');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = require('../../routes/initialize');
var routers = require('../../routes');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routers._APICache);
app.use(response);




app.use('/',router);


var agent = request.agent(app);
var requestId;

var res = {};
var req = {};

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

res.badRequest = sinon.spy();

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

describe('/initialize', function(){
    it('should return a string', function(done){
        agent
        .get('/initialize')
        .then(function(resp){
            resp.body.data['x-tag'].should.be.a('string');
            done();
        })
        .catch(function(err){
            done(err);
        });
    });
});

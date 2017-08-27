'use strict';
var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var request = require('supertest');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var mongoose = require('mongoose');
chai.use(sinonChai);

var response = require('../../services/response');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = require('../../routes/users');
var initRouter = require('../../routes/initialize');
var routers = require('../../routes');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routers._APICache);
app.use(response);




app.use('/',router);
app.use('/',initRouter);


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

var tag;
var objId1 = mongoose.Types.ObjectId();
var objId2 = mongoose.Types.ObjectId();
var objId3 = mongoose.Types.ObjectId();
describe('/users', function(){

    before(function(done){ /* jslint ignore:line */
        var workers = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');

        agent
        .get('/initialize')
        .then(function(resp){
            tag = resp.body.data['x-tag'];
            done();
        })
        .catch(function(err){
            done(err);
        });
    });

    it('should create documents', function(done){
        agent
        .post('/users?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
        .set('x-tag',tag)
        .send([{name: 'femi'},{name: 'tolu'},{name: 'bayo'},{name: 'bola'}])
        .expect(200, done);
    });
    it('should create a document');

    describe('Find', function(){
        it('should search for matching documents for a given string');
        it('should limit the number of returned documents');
        it('should contain count of total record for the query');
        it('should return the last document Id in the array of documents returned from a query');
        it('should sort documents in ascending order');
        it('should sort documents in descending order');
        it('should select just few parameters from the documents');
        it('should populate data of a references');
        it('should load next page for pagination');
        it('should filter by date range');
        it('should filter by date range without setting the end date');
    });

    it('should find one document');
    it('should update documents');
    it('should update a document');

    describe('Delete', function(){
        it('should delete multiple data');
        it('should delete one data');
    });

    describe('Restore', function(){
        it('should restore a previously deleted data');
    });


});

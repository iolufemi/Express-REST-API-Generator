"use strict";

var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var queue = require('../../services/queue');

var workers = require('../../services/queue/workers');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var fnv = require('fnv-plus');
var mongoose = require('mongoose');


// Test Index
var jobs;
describe('#Queue service', function(){
    before(function() { /* jslint ignore:line */
        queue.testMode.enter();
        jobs = require('../../services/queue/jobs');
        // Mock Server
        var express = require('express');
        var app = express();
        app.all('/',function(req,res,next){
            res.json({status: 'ok'});
        });

        var server = app.listen('8081',function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('API server listening on host '+host+', port '+port+'!');
        });
    });

    afterEach(function() { /* jslint ignore:line */
        queue.testMode.clear();
    });

    after(function() { /* jslint ignore:line */
        queue.testMode.exit();
    });

    it('should return an object', function(done){
        queue.should.be.an('object');
        queue.should.be.have.property('kue');
        jobs.should.be.an('object');
        workers.should.be.an('object');
        done();
    });

    it('should pass basic smoke test', function() {
        queue.createJob('myJob', 'foo').save();
        queue.createJob('anotherJob', { baz: 'bip' }).save();
        queue.testMode.jobs.length.should.equal(2);
        queue.testMode.jobs[0].type.should.equal('myJob');
        queue.testMode.jobs[0].data.should.equal('foo');
    });

    it('should load processes', function() {
        var process = require('../../services/queue/workers');
        // We have configured queue to create 2 workers per job making a total of 6 workers for 3 jobs that we currently have
        process.workers.length.should.equal(6);
    });

    // Test Jobs
    describe('#Testing Jobs', function(){

        it('should run createRequestLog successfully', function(done){
          var myrequestlog = {
            RequestId: fnv.hash(new Date().valueOf() + '59abab38ead925031a714967', 128).str(),
            ipAddress: '192.168.90.9',
            url: 'http://google.com',
            method: 'POST',
            body: {name: 'femi'},
            createdAt: new Date()
        };
        jobs.createRequestLog(myrequestlog,done);
    });

        it('should run updateRequestLog successfully', function(done){
          var myrequestlog = {
            requestId: fnv.hash(new Date().valueOf() + '59abab38ead925031a714966', 128).str(),
            response: {
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi'},
                createdAt: new Date()
            }
        };
        jobs.updateRequestLog(myrequestlog,done);
    });
        it('should run createSearchTags successfully for saving data', function(done){
            var myrequestlog = {
                RequestId: fnv.hash(new Date().valueOf() + '59abab38ead925031a714969', 128).str(),
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi'},
                createdAt: new Date()
            };

            myrequestlog.model = 'RequestLogs';
            jobs.createSearchTags(myrequestlog,done);
        });

        it('should run createSearchTags successfully for updating data', function(done){
            var myrequestlog = {
                RequestId: fnv.hash(new Date().valueOf() + '59abab38ead925031a714968', 128).str(),
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi'},
                createdAt: new Date()
            };

            myrequestlog.model = 'RequestLogs';
            myrequestlog.update = true;
            jobs.createSearchTags(myrequestlog,done);
        });

        it('should run saveToTrash successfully for backing up data', function(done){
            var backup = {
                data: {
                    _id: mongoose.Types.ObjectId('59abab38ead925031a71496e'),
                    name: 'foo'
                }
            };

            jobs.saveToTrash(backup,done);
        });

        it('should run sendWebhook successfully for sending realtime HTTP notifications', function(done){
            var data =  {
                url: 'http://localhost:8081',
                secure: false, // true or false
                data: {
                    someData: 'this',
                    someOtherData: 'and this'
                }
            };

            jobs.sendWebhook(data,done);
        });

        it('should run sendWebhook successfully for sending realtime HTTP notifications securely', function(done){
            var data =  {
                url: 'http://localhost:8081',
                secure: true, // true or false
                data: {
                    someData: 'this',
                    someOtherData: 'and this'
                }
            };

            jobs.sendWebhook(data,done);
        });

        it('should run sendHTTPRequest successfully for calling web services with POST method', function(done){
            var data =      {
                url: 'http://localhost:8081',
                method: 'POST', // or any http method
                headers: {
                    'User-Agent': 'Femi'
                },
                data: {
                    someData: 'this',
                    someOtherData: 'and this'
                }
            };

            jobs.sendHTTPRequest(data,done);
        });

        it('should run sendHTTPRequest successfully for calling web services with GET method', function(done){
            var data =      {
                url: 'http://localhost:8081',
                method: 'GET', // or any http method
                headers: {
                    'User-Agent': 'Femi'
                },
                data: {
                    someData: 'this',
                    someOtherData: 'and this'
                }
            };

            jobs.sendHTTPRequest(data,done);
        });

        it('should run sendHTTPRequest successfully for calling web services with PUT method', function(done){
            var data =      {
                url: 'http://localhost:8081',
                method: 'PUT', // or any http method
                headers: {
                    'User-Agent': 'Femi'
                },
                data: {
                    someData: 'this',
                    someOtherData: 'and this'
                }
            };

            jobs.sendHTTPRequest(data,done);
        });

        it('should run sendHTTPRequest successfully for calling web services with DELETE method', function(done){
            var data =      {
                url: 'http://localhost:8081',
                method: 'DELETE', // or any http method
                headers: {
                    'User-Agent': 'Femi'
                },
                data: {
                    someData: 'this',
                    someOtherData: 'and this'
                }
            };

            jobs.sendHTTPRequest(data,done);
        });

        it('should run sendHTTPRequest successfully for calling web services with PATCH method', function(done){
            var data =      {
                url: 'http://localhost:8081',
                method: 'PATCH', // or any http method
                headers: {
                    'User-Agent': 'Femi'
                },
                data: {
                    someData: 'this',
                    someOtherData: 'and this'
                }
            };

            jobs.sendHTTPRequest(data,function(err,data){
                if(err){
                    done(err);
                }else{
                    console.log('data Yayyyy! ',data);
                    done();
                }
                

            });
        });

    });
});

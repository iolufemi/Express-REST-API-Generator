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

// Test Index
var jobs;
describe('#Queue service', function(){
    before(function() { /* jslint ignore:line */
        queue.testMode.enter();
        jobs = require('../../services/queue/jobs');
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
            RequestId: 'gdfd6563',
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
            requestId: 'gdfd6563',
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
                RequestId: 'gdfd6563',
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
                RequestId: 'gdfd6563',
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
                    _id: '789878',
                    name: 'foo'
                }
            };

            jobs.saveToTrash(backup,done);
        });

        it('should run sendWebhook successfully for sending realtime HTTP notifications', function(done){
            var data =  {
                url: 'https://httpbin.org/anything',
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
                url: 'https://httpbin.org/anything',
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
                url: 'https://httpbin.org/anything',
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
                url: 'https://httpbin.org/anything',
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
                url: 'https://httpbin.org/anything',
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
                url: 'https://httpbin.org/anything',
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
                url: 'https://httpbin.org/anything',
                method: 'PATCH', // or any http method
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

    });
});

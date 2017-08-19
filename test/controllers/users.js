'use strict';

var chai = require('chai');
chai.should();
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var users = require('../../controllers/Users.js');
var workers = require('../../services/queue/workers');


var userId;
var userId2;
describe('Users controller', function(){
    it('should create documents', function(done){
        var next = function(err){
            done(err);
        };
        var res = {};
        res.ok = function(data){
            data.should.be.an.object; /* jslint ignore:line */
            userId2 = data[0]._id;
            done();
        };
        var req = {};
        req.body = [{
            name: 'Femi',
            someOtherStringData: 'this is pizza'
        },
        {
            name: 'Bolu',
            someOtherStringData: 'this is a meat'
        },
        {
            name: 'Bayo',
            someOtherStringData: 'Meta'
        }];
        users.create(req, res, next);
    });

    it('should create a document', function(done){
        var next = function(err){
            done(err);
        };
        var res = {};
        res.ok = function(data, cache, extraData){

            data.should.be.an.object; /* jslint ignore:line */
            userId = data._id;
            done();
        };
        var req = {};
        req.body = {
            name: 'Femi Olanipekun',
            someOtherStringData: 'FooFoo Tahh',
            toPop: userId2
        };
        users.create(req, res, next);
    });

    describe('Find', function(){
        it('should build projection', function(done){
            var projection = 'name,someOtherStringData';
            var project = users.buildProjection(projection);
            project.should.eventually.be.an('object');
            project.should.eventually.have.property('name');
            project.should.eventually.have.property('someOtherStringData').notify(done);
        });
        it('should search for matching documents for a given string', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){

                data.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.search = 'i like pizza';
            users.find(req, res, next);
        });
        it('should limit the number of returned documents', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){

                data.should.be.an.object; /* jslint ignore:line */
                data.length.should.equal(2);
                done();
            };
            var req = {};
            req.query = {};
            req.query.limit = 2;
            users.find(req, res, next);
        });
        it('should contains count of total record for the query', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){

                data.should.be.an.object; /* jslint ignore:line */
                extraData.total.should.be.a.number; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            users.find(req, res, next);
        });
        it('should return the last document Id in the array of documents returned from a query', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){

                data.should.be.an.object; /* jslint ignore:line */
                extraData.lastId.should.be.a.string; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            users.find(req, res, next);
        });
        it('should sort documents in ascending order', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){

                data.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.sort = 'name';
            users.find(req, res, next);
        });
        it('should sort documents in descending order', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){

                data.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.sort = '-name';
            users.find(req, res, next);
        });
        it('should select just few parameters from the documents', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){

                data.should.be.an.object; /* jslint ignore:line */

                expect(data[0].someOtherStringData).to.be.undefined; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {};
            req.query.projection = 'name';
            users.find(req, res, next);
        });

        it('should populate data of a references', function(done){
            var next = function(err){
                done(err);
            };
            var res = {};
            res.ok = function(data, cache, extraData){
                data[0].toPop.should.be.an.object; /* jslint ignore:line */
                done();
            };
            var req = {};
            req.query = {_id: userId};
            req.query.populate = 'toPop';
            users.find(req, res, next);
        });
    });

it('should find one document', function(done){
    var next = function(err){
        done(err);
    };
    var res = {};
    res.ok = function(data, cache, extraData){
        data.should.be.an.object; /* jslint ignore:line */
        done();
    };
    var req = {};
    req.params = {};
    req.params.id = userId;
    users.findOne(req, res, next);
});
it('should update documents', function(done){
    var next = function(err){
        done(err);
    };
    var res = {};
    res.ok = function(data, cache, extraData){
        data.nModified.should.be.above(0); /* jslint ignore:line */
        done();
    };
    var req = {};
    req.query = {name: 'Femi'};
    req.body = {name: 'Femi Updated'};
    users.update(req, res, next);
});
it('should update a document', function(done){
    var next = function(err){
        done(err);
    };
    var res = {};
    res.ok = function(data, cache, extraData){
        console.log('hhfhf', data);
        data.should.be.an('object'); /* jslint ignore:line */
        done();
    };
    var req = {};
    req.params = {};
    req.params.id = userId;
    users.updateOne(req, res, next);
});
describe('Delete', function(){
    it('should delete multiple data');
    it('should have back up multiple deleted data');
    it('should delete one data');
    it('should have backed up one data');
});
describe('Restore', function(){
    it('should restore a previously deleted data');
});
});

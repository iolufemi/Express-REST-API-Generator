'use strict';

var chai = require('chai');
chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var initialize = require('../../controllers/Initialize.js');

describe('Initialize controller', function(){
    it('should return a string', function(done){
        var next = function(err){
            done(err);
        };
        var res = {};
        res.ok = function(data){
            data.should.be.an.object; /* jslint ignore:line */
            data.should.have.property('x-tag');
            data['x-tag'].should.be.a.string; /* jslint ignore:line */
            done();
        };
        var req;
        initialize.init(req, res, next);
    });
});

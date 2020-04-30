'use strict';

var chai = require('chai');
chai.should();

var models = require('../../models');
describe('#Models test', function(){
    it('should return an object', function(done){
        models.should.be.an('object');
        done();
    });
});

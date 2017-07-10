'use strict';
var chai = require('chai');
chai.should();

var config = require('../../config');

describe('#Config test', function(){
    it('should be an object', function(done){
        config.should.be.an('object');
        done();
    });
});

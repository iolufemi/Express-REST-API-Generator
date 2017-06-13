'use strict';

var chai = require('chai');
chai.should();
var config = require('../config');
var chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
var mongooseMock = require('mongoose-mock');
var proxyquire = require('proxyquire');
// var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var User;
// Testing The User Model
describe('User Model',function(){


    before(function(){  /* jslint ignore:line */
        User = proxyquire('../models/Users', {'mongoose': 'mongooseMock'});
        // User = require('../models/Users');
    });

    describe('Test CRUDS', function(){
        it('should save data', function(done){
            var cb = sinon.spy();
            var myuser = User.create({name: 'femi'});

            myuser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read data', function(done){
            var cb = sinon.spy();
            var myuser = User.findOne({name: 'femi'});

            myuser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read all data', function(done){
            var cb = sinon.spy();
            var myuser = User.find();

            myuser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should update data', function(done){
            var cb = sinon.spy();
            var myuser = User.update({name: 'femi'},{name: 'Olaoluwa'});

            myuser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should update many data', function(done){
            var cb = sinon.spy();
            var myuser = User.updateMany({name: 'femi'},{name: 'Olaoluwa Olanipekun'});

            myuser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should search data', function(done){
            var cb = sinon.spy();
            // Search needs more work for more accuracy
            var myuser = User.search('femi');

            myuser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should delete data', function(done){
            var cb = sinon.spy();
            var cb2 = sinon.spy();
            var ouruser = User.create([{name:'Olaolu'},{name: 'fola'},{name: 'bolu'}]);
            var myuser = User.deleteOne({name: 'bolu'});

            ouruser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                return myuser;
            }).then(function(res){
                cb2();
                cb2.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should delete many data', function(done){
            var cb = sinon.spy();
            var myuser = User.deleteMany({name: 'femi'});

            myuser.then(function(res){
                cb();
                cb.should.have.been.calledOnce; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should add createdAt', function(done){
            var myuser = User.create({name: 'this is for the gods'});

            myuser.then(function(res){
                res.should.have.property('createdAt');
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should add updatedAt', function(done){
            var myuser = User.create({name: 'i am a demigod!'});
            var id;
            myuser.then(function(res){
                id = res._id;
                return User.update({_id: id},{name: 'This is the titan'});
            })
            .then(function(res){
                return User.findOne({_id: id});
            })
            .then(function(res){
                res.should.have.property('updatedAt');
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        // it('should tag database entries properly');

        // it('should tag database entries properly');

        // it('should tag database entries properly');
    });
});


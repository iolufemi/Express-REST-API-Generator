'use strict';

var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
var mongooseMock = require('mongoose-mock');
// var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var User;
// Testing The User Model
describe('User Model',function(){

    var id;
    var id2;

    before(function(){  /* jslint ignore:line */
        User = require('../../models/Users');
        var workers = require('../../services/queue/workers');
        var workers1 = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function(){
        it('should save data', function(done){
            var myuser = User.create({name: 'femi'});

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read data', function(done){
            var myuser = User.findOne({name: 'femi'});

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read all data', function(done){
            var myuser = User.find();

            myuser.then(function(res){
                res.should.be.an.array; /* jslint ignore:line */
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
            // Search needs more work for more accuracy
            var myuser = User.search('femi');

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should delete data', function(done){
            var cb2 = sinon.spy();
            var ouruser = User.create([{name:'Olaolu'},{name: 'fola'},{name: 'bolu'}]);
            var myuser = User.deleteOne({name: 'bolu'});

            ouruser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
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
                id = res._id;
                res.should.have.property('createdAt');
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should add updatedAt', function(done){
            var myuser = User.create({name: 'i am a demigod!'});
            myuser.then(function(res){
                id2 = res._id;
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

        it('should tag database entries properly', function(done){
            var myuser = User.create({name: 'femi',someOtherStringData: 'stuff'});

            setTimeout(function(){
                myuser.then(function(res){
                    return User.findById(res._id);
                })
                .then(function(res){
                    console.log(res);
                    res.tags.length.should.equal(2);/* jslint ignore:line */
                    done();
                })
                .catch(function(err){
                    done(err);
                });
            },3000);
            
        });

        it('should count returned records', function(done){
            var myuser = User.count({name: 'This is the titan'});

            myuser.then(function(res){
                res.should.be.a.number; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find a record by id', function(done){
            var myuser = User.findById(id);

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find a record by id and delete', function(done){
            var myuser = User.findByIdAndRemove(id2);

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find a record by id and update', function(done){
            var myuser = User.findByIdAndUpdate(id,{name: 'fufu'});

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find the first match from a query', function(done){
            var myuser = User.findOne({name: 'fufu'});

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find the first match from a query and update', function(done){
            var myuser = User.findOneAndUpdate({name: 'fufu'},{name: 'funmi'});

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should find the first match from a query and delete', function(done){
            var myuser = User.findOneAndRemove({name: 'funmi'});

            myuser.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

    });
});

// test populate

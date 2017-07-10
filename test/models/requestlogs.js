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

var RequestLog;
// Testing The RequestLogs Model
describe('RequestLog Model',function(){

    var id;
    var id2;

    before(function(){  /* jslint ignore:line */
        RequestLog = require('../../models/RequestLogs');
    });

    describe('Test CRUDS', function(){
        it('should save data', function(done){
            var myrequestlog = RequestLog.create({
                RequestId: 'gdfd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi'},
                createdAt: new Date()
            });

            myrequestlog.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read data', function(done){
            var myrequestlog = RequestLog.findOne({RequestId: 'gdfd6563'});

            myrequestlog.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read all data', function(done){
            var myrequestlog = RequestLog.find();

            myrequestlog.then(function(res){
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should update data', function(done){
            var cb = sinon.spy();
            var myrequestlog = RequestLog.update({RequestId: 'gdfd6563'},{RequestId: 'gfdvdt09876543456789'});

            myrequestlog.then(function(res){
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
            var myrequestlog = RequestLog.updateMany({RequestId: 'gfdvdt09876543456789'},{RequestId: 'gftgd'});

            myrequestlog.then(function(res){
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
            var myrequestlog = RequestLog.search('gftgd');

            myrequestlog.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should delete data', function(done){
            var cb2 = sinon.spy();
            var ourrequestlog = RequestLog.create([{
                RequestId: 'gdfd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi'},
                createdAt: new Date()
            },{
                RequestId: 'gdfd6524242463',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'fqwwemi'},
                createdAt: new Date()
            },{
                RequestId: 'gdfd6534235263',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'fem3i'},
                createdAt: new Date()
            }]);
            var myrequestlog = RequestLog.deleteOne({RequestId: 'gdfd6534235263'});

            ourrequestlog.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                return myrequestlog;
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
    var myrequestlog = RequestLog.deleteMany({RequestId: 'gdfd6524242463'});

    myrequestlog.then(function(res){
        cb();
        cb.should.have.been.calledOnce; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should add createdAt', function(done){
    var myrequestlog = RequestLog.create({RequestId: 'gdfd6563'});

    myrequestlog.then(function(res){
        id = res._id;
        res.should.have.property('createdAt');
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should add updatedAt', function(done){
    var myrequestlog = RequestLog.create({RequestId: 'gdfd6563'});
    myrequestlog.then(function(res){
        id2 = res._id;
        return RequestLog.update({_id: id},{RequestId: 'gdfd65635555555'});
    })
    .then(function(res){
        return RequestLog.findOne({_id: id});
    })
    .then(function(res){
        res.should.have.property('updatedAt');
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should count returned records', function(done){
    var myrequestlog = RequestLog.count({RequestId: 'gdfd65635555555'});

    myrequestlog.then(function(res){
        res.should.be.a.number; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find a record by id', function(done){
    var myrequestlog = RequestLog.findById(id);

    myrequestlog.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find a record by id and delete', function(done){
    var myrequestlog = RequestLog.findByIdAndRemove(id2);

    myrequestlog.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find a record by id and update', function(done){
    var myrequestlog = RequestLog.findByIdAndUpdate(id,{name: 'fufu'});

    myrequestlog.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find the first match from a query', function(done){
    var myrequestlog = RequestLog.findOne({RequestId: 'gdfd65635555555'});

    myrequestlog.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find the first match from a query and update', function(done){
    var myrequestlog = RequestLog.findOneAndUpdate({RequestId: 'gdfd65635555555'},{RequestId: 'gdfd65630987655555555'});

    myrequestlog.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find the first match from a query and delete', function(done){
    var myrequestlog = RequestLog.findOneAndRemove({RequestId: 'gdfd65630987655555555'});

    myrequestlog.then(function(res){
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

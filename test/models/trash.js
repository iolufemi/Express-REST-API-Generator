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

var Trash;
// Testing The Trashs Model
describe('Trash Model',function(){

    var id;
    var id2;

    before(function(){  /* jslint ignore:line */
        Trash = require('../../models/Trash');
        var workers = require('../../services/queue/workers');
    });

    describe('Test CRUDS', function(){
        it('should save data', function(done){
            var mytrash = Trash.create({data: {
                RequestId: 'gdfd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi'},
                createdAt: new Date()
            }});

            mytrash.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read data', function(done){
            var mytrash = Trash.findOne({'data.RequestId': 'gdfd6563'});

            mytrash.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should read all data', function(done){
            var mytrash = Trash.find();

            mytrash.then(function(res){
                res.should.be.an.array; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should update data', function(done){
            var cb = sinon.spy();
            var mytrash = Trash.updateMany({'data.RequestId': 'gdfd6563'},{'data.RequestId': 'gfdvdt09876543456789'});

            mytrash.then(function(res){
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
            var mytrash = Trash.updateMany({'data.RequestId': 'gfdvdt09876543456789'},{'data.RequestId': 'kokoko456789'});

            mytrash.then(function(res){
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
            var mytrash = Trash.search('kokoko456789');

            mytrash.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should delete data', function(done){
            var cb2 = sinon.spy();
            var ourtrash = Trash.create([{data: {
                RequestId: 'gdfd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi'},
                createdAt: new Date()
            }},{data: {
                RequestId: 'gsdfghjk98765dfd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'fe6mi'},
                createdAt: new Date()
            }},{data: {
                RequestId: 'gdf099olllojd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi4'},
                createdAt: new Date()
            }}]);
            var mytrash = Trash.deleteOne({'data.RequestId': 'kokoko456789'});

            ourtrash.then(function(res){
                res.should.be.an.object; /* jslint ignore:line */
                return mytrash;
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
    var mytrash = Trash.deleteMany({'data.RequestId': 'kokoko456789'});

    mytrash.then(function(res){
        cb();
        cb.should.have.been.calledOnce; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should add createdAt', function(done){
    var mytrash = Trash.create({data: {
                RequestId: 'gdf099olllojd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi4'},
                createdAt: new Date()
            }});

    mytrash.then(function(res){
        id = res._id;
        res.should.have.property('createdAt');
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should add updatedAt', function(done){
    var mytrash = Trash.create({data: {
                RequestId: 'gdf099olllojd6563',
                ipAddress: '192.168.90.9',
                url: 'http://google.com',
                method: 'POST',
                body: {name: 'femi4'},
                createdAt: new Date()
            }});
    mytrash.then(function(res){
        id2 = res._id;
        return Trash.updateMany({_id: id},{'data.RequestId': 'kgtggokoko456789'});
    })
    .then(function(res){
        return Trash.findOne({_id: id});
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
    var mytrash = Trash.estimatedDocumentCount({'data.RequestId': 'kgtggokoko456789'});

    mytrash.then(function(res){
        res.should.be.a.number; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find a record by id', function(done){
    var mytrash = Trash.findById(id);

    mytrash.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find a record by id and delete', function(done){
    var mytrash = Trash.findByIdAndRemove(id2);

    mytrash.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find a record by id and update', function(done){
    var mytrash = Trash.findByIdAndUpdate(id,{name: 'fufu'});

    mytrash.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find the first match from a query', function(done){
    var mytrash = Trash.findOne({'data.RequestId': 'kgtggokoko456789'});

    mytrash.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find the first match from a query and update', function(done){
    var mytrash = Trash.findOneAndUpdate({'data.RequestId': 'kgtggokoko456789'},{'data.RequestId': 'kgtggohyu0900koko456789'});

    mytrash.then(function(res){
        res.should.be.an.object; /* jslint ignore:line */
        done();
    })
    .catch(function(err){
        done(err);
    });
});

it('should find the first match from a query and delete', function(done){
    var mytrash = Trash.findOneAndRemove({'data.RequestId': 'kgtggohyu0900koko456789'});

    mytrash.then(function(res){
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

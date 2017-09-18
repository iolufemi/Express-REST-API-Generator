'use strict';
var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var request = require('supertest');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var mongoose = require('mongoose');
chai.use(sinonChai);
var _ = require('lodash');

var response = require('../../services/response');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var initRouter = require('../../routes/initialize');
var routers = require('../../routes');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(response);
app.use(routers);


var agent = request.agent(app);
var requestId;

var res = {};
var req = {};

var nextChecker = false;    
var next = function(){
    if(arguments.length > 0){
        console.log(arguments[0]);
    }else{
        nextChecker = true;
    }
    
    return nextChecker;
};
res.json = function(data){
    return res;
};

res.badRequest = sinon.spy();

res.status = function(status){
    return res;
};

var header = {};
res.set = function(key, value){
    header[key] = value;
    return header[key];
};
req.get = function(key){
    return header[key];
};

header.set = function(data){
    header.temp = data;
    return header.temp;
};

req.method = '';

var tag;
var objId1 = mongoose.Types.ObjectId('59abab38ead925031a71496d');
var objId2 = mongoose.Types.ObjectId('59abab38ead925031a71496e');
var objId3 = mongoose.Types.ObjectId('59abab38ead925031a71496c');
var last;
var oneId;
var oneId2;
var from = new Date(new Date().setMinutes(new Date().getMinutes() - 3)).toISOString();
describe('/<%= object %>s', function(){

    before(function(done){ /* jslint ignore:line */
        var workers = require('../../services/queue/workers');
        var workers2 = require('../../services/queue/workers');
        var workers3 = require('../../services/queue/workers');

        agent
        .get('/initialize?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
        .then(function(resp){

            tag = resp.body.data['x-tag'];
            done();
        })
        .catch(function(err){
            done(err);
        });
    });

    it('should create a document', function(done){
        agent
        .post('/<%= object %>s?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
        .set('x-tag',tag)
        .send({name: 'femi2'})
        .then(function(resp){
            console.log(resp.body.data);
            oneId = resp.body.data._id;
            resp.body.data.should.have.property('client');
            resp.body.data.should.have.property('owner');
            resp.body.data.should.have.property('createdBy');
            resp.body.data.should.have.property('developer');
            done();
        })
        .catch(function(err){
            done(err);
        });
    });

    it('should create documents', function(done){
        agent
        .post('/<%= object %>s?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
        .set('x-tag',tag)
        .send([{name: 'femi',toPop: oneId},{name: 'tolu',toPop: oneId},{name: 'femi2',toPop: oneId},{name: 'bola',toPop: oneId}])
        .then(function(resp){
            oneId2 = resp.body.data[0]._id;
            resp.body.data.length.should.be.above(0);
            _.map(resp.body.data, function(val){
                val.should.have.property('client');
                val.should.have.property('owner');
                val.should.have.property('createdBy');
                val.should.have.property('developer');
                return val;
            });
            done();
        })
        .catch(function(err){
            done(err);
        });
    });
    

    describe('Find', function(){
        it('should search for matching documents for a given string', function(done){
            agent
            .get('/<%= object %>s?search=femi&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .expect(200, done);
        });
        it('should limit the number of returned documents',function(done){
            agent
            .get('/<%= object %>s?limit=2&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .then(function(resp){
                resp.body.data.length.should.equal(2);
                done();
            })
            .catch(function(err){
                done(err);
            });
        });
        it('should contain count of total record for the query', function(done){
            agent
            .get('/<%= object %>s?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .then(function(resp){
                resp.body.total.should.exist; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });
        it('should return the last document Id in the array of documents returned from a query', function(done){
            agent
            .get('/<%= object %>s?limit=2&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .then(function(resp){
                console.log('>>>>>>>>>>>>>>>>',resp.body);
                last = resp.body.lastId;
                resp.body.lastId.should.exist; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });
        it('should sort documents in ascending order', function(done){
            agent
            .get('/<%= object %>s?sort=name&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .expect(200,done);
        });
        it('should sort documents in descending order', function(done){
            agent
            .get('/<%= object %>s?sort=-name&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .expect(200,done);
        });
        it('should select just few parameters from the documents', function(done){
            agent
            .get('/<%= object %>s?select=name&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .expect(200,done);
        });
        it('should populate data of a reference for multiple data', function(done){
            agent
            .get('/<%= object %>s?populate=toPop&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .then(function(resp){
                _.forEach(resp.body.data, function(value){
                    if(value._id === oneId2){
                        value.toPop.should.be.an('object');
                    }
                });
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should populate data of a reference for single data', function(done){
            agent
            .get('/<%= object %>s/'+oneId2+'?populate=toPop&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .then(function(resp){
                resp.body.data.toPop.should.be.an('object');
                done();
            })
            .catch(function(err){
                done(err);
            });
        });

        it('should load next page for pagination', function(done){
            agent
            .get('/<%= object %>s?lastId='+last+'&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .expect(200,done);
        });
        it('should filter by date range', function(done){
            agent
            .get('/<%= object %>s?from='+from+'&to='+new Date().toISOString()+'&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .then(function(resp){
                resp.body.data.length.should.be.above(0);
                done();
            })
            .catch(function(err){
                done(err);
            });
        });
        it('should filter by date range without setting the end date', function(done){
            agent
            .get('/<%= object %>s?from='+from+'&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag)
            .then(function(resp){
                resp.body.data.length.should.be.above(0);
                done();
            })
            .catch(function(err){
                done(err);
            });
        });
    });

it('should find one document', function(done){
    agent
    .get('/<%= object %>s/'+oneId+'?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
    .set('x-tag',tag)
    .then(function(resp){
        resp.body.data.should.be.an('object');
        done();
    })
    .catch(function(err){
        done(err);
    });
});
it('should update documents', function(done){
    agent
    .put('/<%= object %>s?name=femi&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
    .set('x-tag',tag)
    .send({name: 'Bukola'})
    .then(function(resp){
        resp.body.data.should.be.an('object');
        done();
    })
    .catch(function(err){
        done(err);
    });
});
it('should update a document', function(done){
    agent
    .patch('/<%= object %>s/'+oneId+'?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
    .set('x-tag',tag)
    .send({name: 'Bukola'})
    .then(function(resp){
        resp.body.data.should.be.an('object');
        done();
    })
    .catch(function(err){
        done(err);
    });
});

describe('Delete', function(){

    it('should delete multiple data', function(done){
        agent
        .delete('/<%= object %>s?name=femi2&userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
        .set('x-tag',tag)
        .then(function(resp){

            resp.body.data.should.be.an('array');
            done();
        })
        .catch(function(err){
            done(err);
        });
    });

    it('should delete one data', function(done){
        agent
        .delete('/<%= object %>s/'+oneId+'?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
        .set('x-tag',tag)
        .then(function(resp){
            resp.body.data.should.be.an('object');
            done();
        })
        .catch(function(err){
            done(err);
        });
    });
});

describe('Restore', function(){
    it('should restore a previously deleted data', function(done){
        var Trash = require('../../models').Trash;
        Trash.findOne({service:'<%= service %>s'})
        .then(function(resp){
            return agent
            .post('/<%= object %>s/'+resp._id+'/restore?userId='+objId1.toString()+'&appId='+objId2.toString()+'&developer='+objId3.toString())
            .set('x-tag',tag);
        })
        .then(function(resp){
            resp.body.data.should.be.an('object');
            done();
        })
        .catch(function(err){
            done(err);
        });
    });
});
});

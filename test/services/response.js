'use strict';

var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var crypto = require('crypto');

// init

var res = {};
var req = {};
var demoData = '{"el escribimos": "silencio es dorado"}';
var demoDataHash = crypto.createHash('sha512')
.update(demoData)
.digest('hex');

console.log('hash', demoDataHash);
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

var response = require('../../services/response');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('supertest');
var router = require('../../routes');

// Dummy App
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(response);
app.use(router._APICache);


app.get('/ok', function(req,res){
    res.ok('It worked!');
});

app.get('/badRequest', function(req,res){
    res.badRequest('It worked!');
});

app.get('/forbidden', function(req,res){
    res.forbidden('It worked!');
});

app.get('/notFound', function(req,res){
    res.notFound('It worked!');
});

app.get('/serverError', function(req,res){
    res.serverError('It worked!');
});

app.get('/unauthorized', function(req,res){
    res.unauthorized('It worked!');
});


var encryption = require('../../services/encryption');
var app2 = express();

// Dummy App
app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());
app2.use(response);
app2.use(encryption.interpreter);

app2.post('/secure', function(req,res){
    res.ok('It worked!');
});

var agent = request(app);

var agent2 = request(app2);

// Testing response service


describe('#Response service test', function(){

    before(function(){ /* jslint ignore:line */
        var workers = require('../../services/queue/workers');
    });

    it('should add property ok, badRequest, forbidden, notFound, serverError and unauthorized to res object', function(done){
        response(req,res,next);
        nextChecker = false; 
        res.should.have.property('ok');
        res.should.have.property('badRequest');
        res.should.have.property('forbidden');
        res.should.have.property('notFound');
        res.should.have.property('serverError');
        res.should.have.property('unauthorized');
        done();
    });

    it('should be ok', function(done){
        agent.
        get('/ok')
        .expect(200,done);
    });

    console.log(process.env.NO_CACHE);
    if(config.noFrontendCaching !== 'yes'){
        it('should be a cached response', function(done){
            agent.
            get('/ok')
            .expect(200)
            .then(function(res){
                console.log(res.body);
                res.body.cached.should.be.true; /* jslint ignore:line */
                done();
            })
            .catch(function(err){
                done(err);
            });
        });
    }

    it('should be a badRequest', function(done){
        agent.
        get('/badRequest')
        .expect(400,done);
    });
    it('should be forbidden', function(done){
        agent.
        get('/forbidden')
        .expect(403,done);
    });
    it('should not be found', function(done){
        agent.
        get('/notFound')
        .expect(404,done);
    });
    it('should be unauthorized', function(done){
        agent.
        get('/unauthorized')
        .expect(401,done);
    });
    it('should be a serverError', function(done){
        agent.
        get('/serverError')
        .expect(500,done);
    });

    it('should be an encrypted response', function(done){
        var tag;
        encryption.generateKey()
        .then(function(res){
            tag = res;
            return encryption.encrypt(demoData, tag);
        })
        .then(function(res){
            console.log('Our encrypted data: ', res.encryptedText);
            return agent2.
            post('/secure')
            .set('x-tag', tag)
            .send({truth: res.truth,secureData: res.encryptedText, secure: true})
            .expect(200);
        })
        .then(function(res){
            console.log('Our response body: ', res.body);
            var data = res.body;
            data.secure.should.be.true; /* jslint ignore:line */
            done();
        })
        .catch(function(err){
            done(err);
        });
    });

    it('should detect tampered data', function(done){
        var tag;
        encryption.generateKey()
        .then(function(res){
            tag = res;
            var demoData2 = '{"escribimos": "silencios es dorado"}';
            return encryption.encrypt(demoData2, tag);
        })
        .then(function(res){
            console.log('Our encrypted data: ', res);
            return agent2.
            post('/secure')
            .set('x-tag', tag)
            .send({truth: demoDataHash,secureData: res.encryptedText, secure: true})
            .expect(500);
        })
        .then(function(res){
            console.log('Our response body: ', res.body);
            done();
        })
        .catch(function(err){
            done(err);
        });
    });

});

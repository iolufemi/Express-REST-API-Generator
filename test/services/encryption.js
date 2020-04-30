'use strict';

process.env.SECURE_MODE = true;

var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require('chai-as-promised');
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

// Testing encryption service

var encryption = require('../../services/encryption');

describe('#Encryption service test', function(){
    it('should have property generateKey, encrypt, decrypt and interpreter', function(done){
        
        encryption.should.have.property('generateKey');
        encryption.should.have.property('encrypt');
        encryption.should.have.property('decrypt');
        encryption.should.have.property('interpreter');
        done();
    });
    
    
    it('should generate key', function(done){
        encryption.generateKey().should.eventually.be.a('string').notify(done);
    });

    it('should encrypt and decrypt data', function(done){
        encryption.generateKey()
            .then(function(resp){
                header['x-tag'] = resp;
            
                return encryption.encrypt(demoData, req.get('x-tag'));
            })
            .then(function(resp){
                console.log('encrypted data: ', resp);
                res.set('encryptedData', resp.encryptedText);
                console.log('hash: ', demoDataHash, 'generated hash: ', resp.truth);
                return encryption.decrypt(resp.encryptedText, req.get('x-tag'), resp.truth);
            })
            .then(function(resp){
                console.log('decrypted data: ', resp);
                resp.should.be.a('string');
                done();
            })
            .catch(function(err){
                done(err);
            });
    });
    
    it('should detect compromised data', function(done){
        encryption.decrypt('5b9f535be7edbad69ac03aced46f6586c1b2d', req.get('x-tag'), demoDataHash)
            .then(function(resp){
                done(resp);
            })
            .catch(function(err){
                if(err.message === 'Data integrity compromised!'){
                    done();
                }else{
                    done(err);
                }
            });
    });
    
    it('should interpret data when data is not POST', function(done){
        encryption.interpreter(req,res,next);
        nextChecker.should.be.true; /* jslint ignore:line */
        nextChecker = false;
        done();
    });
    
    it('should interpret data when data is POST', function(done){
        req.method = 'POST';
        req.body = {};
        req.body.secureData = req.get('encryptedData');
        req.body.truth = demoDataHash;
        encryption.interpreter(req,res,next);
        setTimeout(function(){
            nextChecker.should.be.true; /* jslint ignore:line */
            nextChecker = false;
        },1000);
        done();
    });
});

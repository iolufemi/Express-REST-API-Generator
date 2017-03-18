"use strict";
var aesjs = require('aes-js');
var crypto = require('crypto');
var config = require('../../config');
var randomstring = require('randomstring');
var q = require('q');
var debug = require('debug')('encryption');

module.exports = {
	generateKey: function(flutterwaveApiKey, flutterwaveMerchantKey){
		return q.Promise(function(resolve, reject){
			var salt = randomstring.generate(256);
			debug('salt: ', salt);

			var bits = 256;

			crypto.pbkdf2(flutterwaveApiKey+flutterwaveMerchantKey, salt, 100000, bits / 8, 'sha512', function(err, key){
				if (err){
					reject(new Error(err));
				}else{
					var randomNumber = Math.floor((Math.random() * 9999) + 1);
					resolve(new Buffer(aesjs.util.convertBytesToString(key, 'hex')+'//////'+randomNumber).toString('base64'));
				}
			});
		});
	},

	encrypt: function(text, key){
		debug('started encryption');
		debug('using key: ', key);
		key = new Buffer(key, 'base64').toString('utf-8');
		debug('What i see here: ', key);
		var splitKey = key.split('//////');
		key = splitKey[0];
		var counter = ((splitKey[1] * 1) * 10) / 5;
		debug('our counter: ', counter);
		debug('our key: ', key);
		key = aesjs.util.convertStringToBytes(key, 'hex');
		debug('in buffer: ', key);

		return q.Promise(function(resolve){
			debug('encrypting...');
			debug('our key: ', key);

		    // Convert text to bytes
		    debug('our text: ',text);
		    var textBytes = aesjs.util.convertStringToBytes(text);
		    debug('textBytes: ',textBytes);
		    var aesCbc = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(counter));
		    var encryptedBytes = aesCbc.encrypt(textBytes);

		    // Convert our bytes back into text
		    var encryptedText = aesjs.util.convertBytesToString(encryptedBytes, 'hex');
		    debug('finished encryption');
		    resolve(encryptedText);
		});
	},

	decrypt: function(text, key){
		debug('text: ',text);
		key = new Buffer(key, 'base64').toString('utf-8');
		debug('What i see here: ', key);
		var splitKey = key.split('//////');
		key = splitKey[0];
		var counter = ((splitKey[1] * 1) * 10) / 5;
		debug('our counter: ', counter);
		debug('our key: ', key);
		key = aesjs.util.convertStringToBytes(key, 'hex');

		return q.Promise(function(resolve){
			debug('our key2: ', key);
		    // Convert text to bytes
		    var textBytes = aesjs.util.convertStringToBytes(text, 'hex');

		    // The cipher-block chaining mode of operation maintains internal
	        // state, so to decrypt a new instance must be instantiated.
	        var aesCbc = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(counter));
	        var decryptedBytes = aesCbc.decrypt(textBytes);

	        // Convert our bytes back into text
	        var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
	        resolve(decryptedText);
	    });
	},

	interpreter: function(req, res, next){
		var encryption = require('./');
		if(req.header('x-tag')){
			res.set('x-tag', req.header('x-tag'));
			res.set('Access-Control-Expose-Headers','x-tag');

			var key = req.header('x-tag');

			if(req.method === 'POST' && config.secureMode){
				if(req.body.secureData){
					encryption.decrypt(req.body.secureData, key)
					.then(function(resp){
						if(typeof resp === 'object'){
							req.body = resp;
							next();
						}else{
							debug('decryptedText: ', resp);
							var parsedJSON = JSON.parse(resp);
							req.body = parsedJSON;
							next();
						}
					})
					.catch(function(err){
						next(err);
					});
				}else{
					res.badRequest(false,'Expecting an encrypted data to be sent in the secureData body parameter.');
				}
			}else{
				next();
			}
		}else if(req.method !== 'POST'){
			next();
		}else{
			res.badRequest(false,'Please initialize and send the x-tag header in every request.');
		}
	}
};

'use strict';
var encryption = require('../services/encryption');
var config = require('../config');
var debug = require('debug')('initialize');

module.exports = {
    init: function(req, res, next){
        encryption.generateKey()
            .then(function(resp){
                res.ok({'x-tag': resp});
            })
            .catch(function(err){
                next(err);
            });
    }
};

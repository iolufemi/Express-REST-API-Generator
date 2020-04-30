'use strict';
const { check, validationResult } = require('express-validator');
var debug = require('debug')('validator');

module.exports = async function(req, res, next){
    debug('starting validation check.');
    debug('What we got: ', req.body);
    var parameters = req._required;
    var ignores = req._ignored;
    if(parameters.length){
        var last = parameters.length - 1;
        for(var n in parameters){
            if(parameters[n]){
                debug('validating '+parameters[n]);
                await check(parameters[n], parameters[n]+' is required').trim().escape().notEmpty().run(req);
                
                if(n*1 === last){
                    debug('parameters: ', parameters[n]);
                    debug('validation over, lets take it home...');
                    var errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        res.badRequest(errors.array(), 'Validation error.');
                    }else{
                        next();
                    }
                }
            }
        }
    }else{
        next();
    }
    
};

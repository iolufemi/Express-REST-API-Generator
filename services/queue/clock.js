"use strict";

var CronJob = require('cron').CronJob;
var log = require('../logger');
var Model = require('./Model');
var queue = require('./');
var _ = require('lodash');
var config = require('../../config');

log.info('Starting Queue Clock...');
Model.find({enabled: true})
.then(function(jobs){
    _.forEach(jobs, function(job){
        log.info('Initializing '+job.name+'...');
        var cron = new CronJob({
            cronTime: job.crontab,
            onTick: function(){
                // run this
                // Check if job is enabled
                Model.findOne({_id: job._id, enabled: true})
                .then(function(resp){
                    if(!resp){
                        throw {notEnabled: true};
                    }else{
                        log.info('Pushing '+job.name+' to queue...');
                        queue.create(job.job, job.arguments)
                        .save();
                    }
                })
                .catch(function(err){
                    if(err.notEnabled){
                        log.info(job.name+' is not enabled. Skipping...');
                    }else{
                        log.error('An error occured while running Job - '+job.name, err);
                    }
                });

            },
            start: true,
            timeZone: config.clockTimezone
        });
    });
})
.catch(function(err){
    log.error('An error occured while starting the queue clock: ', err);
});

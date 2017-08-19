"use strict";

var Users = require('../models').Users;
var Trash = require('../models').Trash;
var q = require('q');
var queue = require('../services/queue');
var debug = require('debug')('usersController');

var service = 'Users';

var UsersController = {};

UsersController.buildProjection = function(projections){
    debug('starting build...');
    var projection = projections.split(','); // Projection should be comma separated. eg. name,location
    // ToDo: Test buildProjection function
    return q.Promise(function(resolve,reject,notify){
        debug('This is a promise...');
        var num = projection.length;
        var last = num - 1;
        var select = {};
        for(var n in projection){
            if(typeof projection[n] === 'string'){
                debug('Processing...', projection[n]);
                notify('Adding '+projection[n]+' to projection');
                select[projection[n]] = 1;
                if(n * 1 === last){
                    debug('Coming out of the loop...', select);
                    notify('Ending Build.');
                    return resolve(select);
                }
            }else{
                debug('Skiping...', projection[n]);
                if(n * 1 === last){
                    debug('Coming out of the loop......', select);
                    notify('Ending Build..');
                    return resolve(select);
                }
            }
        }
    });
};

UsersController.find = function(req,res,next){
    var query;
    if(req.query.search){
        query = req.query.search;
        Users.search(query)
        .then(function(resp){
            res.ok(resp);
        })
        .catch(function(err){
            next(err);
        });
        // ToDo: Test that search works
    }else{
        query = req.query;
        var projection = query.projection; // Projection should be comma separated. eg. name,location
        var ourProjection;
        
        if(projection){
            ourProjection = this.buildProjection(projection);
            delete query.projection;
        }
        var limit = query.limit * 1;
        if(limit){
            delete query.limit;
        }
        
        var from = query.from;
        var to = query.to;
        if(from){
            query.createdAt = {};
            query.createdAt.$gt = from;
            delete query.from;
            if(to){
                delete query.to;
            }else{
                to = new Date().toISOString();
            }
            query.createdAt.$lt = to;
        }else{
            query.createdAt = {};
            query.createdAt.$gt = new Date('1989-03-15T00:00:00').toISOString();
            delete query.from;
            if(to){
                delete query.to;
            }else{
                to = new Date().toISOString();
            }
            query.createdAt.$lt = to;
        }
        var lastId = query.lastId;
        if(lastId){
            query._id = {};
            query._id.$gt = lastId;
            delete query.lastId;
        }
        var sort = query.sort; // -fieldName: means descending while fieldName without the minus mean ascending bith by fieldName. eg, '-fieldName1 fieldName2'
        if(sort){
            delete query.sort;
        }
        var populate = query.populate; // Samples: 'name location' will populate name and location references. only supports this for now | 'name', 'firstname' will populate name referenece and only pick the firstname attribute
        if(populate){
            delete query.populate;
        }
        var total = Users.count(query);
        var question = Users.find(query);

        if(limit){
            var ourLimit = limit * 1;
            question = question.limit(limit);
        }else{
            limit = 0;
        }
        if(sort){
            question = question.sort(sort);
        }
        if(populate){
            question = question.populate(populate);
        }

        if(projection){
            q.all([ourProjection,total])
            .spread(function(resp,total){
                return [question.select(resp),total];
            })
            .spread(function(resp,total){
                var ourLastId = resp[resp.length - 1]._id;
                var extraData = {};
                extraData.limit = limit * 1;
                extraData.total = total;
                extraData.lastId = ourLastId;
                res.ok(resp, false, extraData);
            })
            .catch(function(err){
                next(err);
            });
        }else{
            q.all([question,total])
            .spread(function(resp,total){
                var ourLastId;
                if(resp.length === 0){
                    ourLastId = null;
                }else{
                    ourLastId = resp[resp.length - 1]._id;
                }
                var extraData = {};
                extraData.limit = limit * 1;
                extraData.total = total;
                extraData.lastId = ourLastId;
                res.ok(resp, false, extraData);
            })
            .catch(function(err){
                next(err);
            });
            // ToDo: Test limiting
            // ToDO: Test that response contains count of total record for the query
            // ToDo: Test that the last document Id in the return array of documents is in the response
            // ToDo: Test that sorting works
            // ToDo: Test that projection works
            // ToDo: Test that populating works
            // ToDo: Test that date range works
        }

    }
};

UsersController.findOne = function(req,res,next){
    var id = req.params.id;
    Users.findById(id)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.create = function(req,res,next){
    var data  = req.body;
    Users.create(data)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.update = function(req,res,next){
    var query = req.query;
    var data  = req.body;
    Users.updateMany(query,data)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.updateOne = function(req,res,next){
    var id = req.params.id;
    var data  = req.body;
    Users.findByIdAndUpdate(id,data)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.delete = function(req,res,next){
    var query = req.query;
    // Find match
    Users.find(query)
    .then(function(resp){
        var num = resp.length;
        var last = num - 1;
        for(var n in resp){
            if(typeof resp === 'object'){
                // Backup data in Trash
                var backupData = {};
                backupData.service = service;
                backupData.data = resp[n];
                backupData.owner = req.userId;
                backupData.deletedBy = req.userId;
                backupData.client = req.appId;
                backupData.developer = req.developer;

                queue.create('saveToTrash', backupData)
                .save();
                if(n * 1 === last){
                    return resp;
                }
            }else{
                if(n * 1 === last){
                    return resp;
                }
            }
        }
    })
    .then(function(resp){
        // Delete matches
        return Users.deleteMany(query);
    })
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.deleteOne = function(req,res,next){
    var id = req.params.id;
    // Find match
    Users.findById(id)
    .then(function(resp){
        // Backup data in Trash
        var backupData = {};
        backupData.service = service;
        backupData.data = resp;
        backupData.owner = req.userId;
        backupData.deletedBy = req.userId;
        backupData.client = req.appId;
        backupData.developer = req.developer;

        queue.create('saveToTrash', backupData)
        .save();
        return [resp];
    })
    .then(function(resp){
        // Delete match
        return Users.findByIdAndRemove(id);
    })
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.restore = function(req,res,next){
    var id = req.params.id;
    // Find data by ID from trash 
    Trash.findById(id)
    .then(function(resp){
        if(resp.service === service){
            // Restore to DB
            return Users.create(resp.data);
        }else{
            throw new Error('This data does not belong to this service');
        }
    })
    .then(function(resp){
        // Delete from trash
        return [Trash.findByIdAndRemove(id), resp];
    })
    .spread(function(trash, resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

module.exports = UsersController;

// Todo: Test users controller
// ToDo: Test that any deleted data is backed up

"use strict";

var Users = require('../models').Users;
var q = require('q');

var UsersController = {};

UsersController.buildProjection = function(projection){
    // ToDo: Test buildProjection function
    return q.Promise(function(resolve,reject,notify){
        var num = projection.length;
        var last = num - 1;
        var select = {};
        for(var n in projection){
            if(typeof projection[n] === 'string'){
                notify('Adding '+projection[n]+' to projection');
                select[projection[n]] = 1;
                if(n === last){
                    return resolve(select);
                }
            }else{
                if(n === last){
                    return resolve(select);
                }
            }
        }
    });
};

UsersController.find = function(req,res,next){
    var query = req.query;
    var projection = query.projection.split(',');
    var ourProjection;
    query.createdAt = {};
    if(projection){
        ourProjection = this.buildProjection(projection);
        delete query.projection;
    }
    var limit = query.limit;
    if(limit){
        delete query.limit;
    }
    var to = query.to;
    if(to){
        delete query.to;
    }
    var from = query.from;
    if(from){
        query.createdAt.$gt = from;
        delete query.from;
        if(!to){
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
        // ToDo: Test limiting
        // ToDO: Test that response contains count of total record for the query
        // ToDo: Test that the last document Id in the return array of documents is in the response
        // ToDo: Test that sorting works
        // ToDo: Test that projection works
        // ToDo: Test that populating works
        // ToDo: Test that date range works
    }
};

UsersController.findOne = function(req,res,next){
    var id = req.query.id;
    Users.findById(id)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.search = function(req,res,next){
    var query = req.query.query;
    Users.search(query)
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
    Users.update(query,data)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.updateOne = function(req,res,next){
    var id = req.query.id;
    var data  = req.body;
    Users.findByIdAndUpdate(id,data)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.count = function(req,res,next){
    var query = req.query;
    if(!query){
        query = {};
    }
    Users.count(query)
    .then(function(resp){
        res.ok(resp);
    })
    .catch(function(err){
        next(err);
    });
};

UsersController.delete = function(query){
    // Find match
    // Push match to a queue for back up
    // Delete matches
    return Users.deleteMany(query);
};

UsersController.deleteOne = function(id){
    // Find match
    // Push match to a queue for back up
    // Delete matches
    return Users.findByIdAndRemove(id);
};

UsersController.restore = function(query){
    // Find data by ID from trash 
    // Restore to DB
    // Delete from trash
    return Users.count(query);
};

module.exports = UsersController;

// Todo: Finish users controller
// Todo: Finish users route
// ToDo: Test that any deleted data is backed up

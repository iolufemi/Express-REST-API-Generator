"use strict";

var db = require('../services/database/mongo');

var collection = 'RequestLogs';

var service = 'Users';

var debug = require('debug')(collection);

var schemaObject = {
    RequestId: {
        type: 'String'
    },
    ipAddress: {
        type: 'String'
    },
    url: {
        type: 'String'
    },
    method: {
        type: 'String'
    },
    service: {
        type: 'String',
        default: service
    },
    body: {
        type: db.Schema.Types.Mixed
    },
    app: {
        type: db.Schema.Types.ObjectId,
        ref: 'Applications'
    },
    user: {
        type: db.Schema.Types.ObjectId,
        ref: 'Users'
    },
    device: {
        type: 'String'
    },
    response: {
        type: db.Schema.Types.Mixed
    },
};

schemaObject.createdAt = {
    type: 'Date',
    default: Date.now
};

schemaObject.updatedAt = {
    type: 'Date'
    // default: Date.now
};

schemaObject.owner = {
    type: db.Schema.Types.ObjectId,
    ref: 'Users'
};

schemaObject.createdBy = {
    type: db.Schema.Types.ObjectId,
    ref: 'Users'
};

schemaObject.client = {
    type: db.Schema.Types.ObjectId,
    ref: 'Clients'
};

schemaObject.developer = {
    type: db.Schema.Types.ObjectId,
    ref: 'Users'
};

schemaObject.tags = {
    type: [String],
    index: 'text'
};

// Let us define our schema
var Schema = db.Schema(schemaObject);

// Index all text for full text search
// MyModel.find({$text: {$search: searchString}})
//    .skip(20)
//    .limit(10)
//    .exec(function(err, docs) { ... });
// Schema.index({'tags': 'text'});

Schema.statics.search = function(string) {
    return this.find({$text: {$search: string}}, { score : { $meta: "textScore" } })
    .sort({ score : { $meta : 'textScore' } });
};

// assign a function to the "methods" object of our Schema
// Schema.methods.someMethod = function (cb) {
//     return this.model(collection).find({}, cb);
// };

// assign a function to the "statics" object of our Schema
// Schema.statics.someStaticFunction = function(query, cb) {
// eg. pagination
    // this.find(query, null, { skip: 10, limit: 5 }, cb);
// };

// Adding hooks

Schema.pre('save', function(next) {
    // Indexing for search
    var ourDoc = this._doc;
    var split = [];
    for(var n in ourDoc){
        if(typeof ourDoc[n] === 'string'){
            split.push(ourDoc[n].split(' '));
        }
    }
    this.tags = split;
    next();
});

Schema.post('init', function(doc) {
  debug('%s has been initialized from the db', doc._id);
});

Schema.post('validate', function(doc) {
  debug('%s has been validated (but not saved yet)', doc._id);
});

Schema.post('save', function(doc) {
  debug('%s has been saved', doc._id);
});

Schema.post('remove', function(doc) {
  debug('%s has been removed', doc._id);
});

Schema.pre('validate', function(next) {
  debug('this gets printed first');
  next();
});

Schema.post('validate', function() {
  debug('this gets printed second');
});

Schema.pre('find', function(next) {
  debug(this instanceof db.Query); // true
  this.start = Date.now();
  next();
});

Schema.post('find', function(result) {
  debug(this instanceof db.Query); // true
  // prints returned documents
  debug('find() returned ' + JSON.stringify(result));
  // prints number of milliseconds the query took
  debug('find() took ' + (Date.now() - this.start) + ' millis');
});

Schema.pre('update', function(next) {
    // Adding updated date
    
    // Indexing for search
    var ourDoc = this._update.$set;
    var split = [];
    for(var n in ourDoc){
        if(typeof ourDoc[n] === 'string'){
            split.push(ourDoc[n].split(' '));
        }
    }

    if(!split){
        this.update(this._conditions,{ $set: { updatedAt: new Date()} });
    }else{
        this.update(this._conditions,{ $set: { updatedAt: new Date()}, $addToSet: {tags: {$each: split}} });
    }
    
    next();
});

var Model = db.model(collection, Schema);

module.exports = Model;

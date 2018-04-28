"use strict";

var db = require('../database').logMongo;

var collection = 'Clock';

var debug = require('debug')(collection);

var schemaObject = {
    job: {
        type: 'String'
    },
    crontab: {
        type: 'String'
    },
    name: {
        type: 'String',
        unique: true
    },
    enabled: {
        type: 'Boolean',
        default: true
    },
    arguments: {
        type: db._mongoose.Schema.Types.Mixed
    },
    lastRunAt: {
        type: db._mongoose.Schema.Types.Mixed
    }
};

schemaObject.createdAt = {
    type: 'Date',
    default: Date.now
};

schemaObject.updatedAt = {
    type: 'Date'
    // default: Date.now
};

// Let us define our schema
var Schema = new db._mongoose.Schema(schemaObject);

var Model = db.model(collection, Schema);

module.exports = Model;

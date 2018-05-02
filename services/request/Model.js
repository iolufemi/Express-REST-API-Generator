"use strict";

var db = require('../database').logMongo;

var collection = 'APICalls';

var debug = require('debug')(collection);

var schemaObject = {
    RequestId: {
        type: 'String',
        unique: true
    },
    uri: {
        type: 'String'
    },
    method: {
        type: 'String'
    },
    service: {
        type: 'String'
    },
    data: {
        type: db._mongoose.Schema.Types.Mixed
    },
    headers: {
        type: db._mongoose.Schema.Types.Mixed
    },
    response: {
        type: db._mongoose.Schema.Types.Mixed
    },
    responseStatusCode: {
        type: 'Number'
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

schemaObject.retriedAt = {
    type: 'Date'
    // default: Date.now
};

// Let us define our schema
var Schema = new db._mongoose.Schema(schemaObject);

var Model = db.model(collection, Schema);

module.exports = Model;

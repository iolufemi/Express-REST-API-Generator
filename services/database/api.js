'use strict';
var mongoose = require('mongoose');
var request = require('request-promise');
var config = require('../../config');
var log = require('../../services/logger');
var debug = require('debug')('apiModel');
var q = require('q');
var _ = require('lodash');


var ApiModel = function(baseurl,endpoint,headers){
    log.info('API connection successful');
    this.headers = {};
    this.headers = _.extend(this.headers, headers);
    this.query = {};
    this.data = null;
    this.id = null;
    this.url = baseurl+'/'+endpoint;

    this.buildSelect = function(select){
        var string = '';
        var list = [];
        if(typeof select !== 'object'){
            throw {statusCode: 400 , message: 'Projection should be an object. EG. {name: 1, place: 1}'};
        }else{
            for(var key in select){
                if(typeof select[key] === 'number'){
                    list.push(key);
                }
            }
            string = list.join(',');
        }
        return string;
    };

    this.call = function(data){
        debug('Sending HTTP ' +data.method+' request to '+data.url+' with data => '+JSON.stringify(data.data)+' and headers => '+JSON.stringify(this.headers)+' all the data => '+JSON.stringify(data));
        // Expected data
        // {
        // url: 'http://string.com',
        // method: 'POST', // or any http method
        // headers: {
        // 'User-Agent': 'Request-Promise'
        // },
        // data: {
        // someData: 'this',
        // someOtherData: 'and this'
        // }
        // }
        var tag = config.apiDBKey;
        this.headers['x-tag'] = tag;
        var options = {
            method: data.method,
            uri: data.url,
            headers: this.headers,
            json: true // Automatically parses the JSON string in the response
        };

        // if(options.qs && options.qs._id && typeof options.qs._id !== 'string'){
        //     options.qs._id = options.qs._id.toString();
        // }

        if(data.method === 'GET'){
            debug(data);
            options.qs = data.qs;
        }else if(data.method === 'POST'){
            options.body = data.data;
        }else{
            options.qs = data.qs;
            options.body = data.data;
            debug('opt: ', options);
        }
        return request(options);
    };

    this.limit = function(limit){
        this.query.limit = limit;
        return this;
    };

    this.select = function(select){
        this.query.select = this.buildSelect(select);
        return this;
    };

    this.sort = function(sort){
        this.query.sort = sort;
        return this;
    };

    this.populate = function(populate){
        this.query.populate = populate;
        return this;
    };

    return this;
};

ApiModel.prototype.search = function(string){
    if(typeof string !== 'string'){
        throw {statusCode: 400 , message: 'Please pass a string to search with'};
    }
    this.query = {};
    this.query = _.extend(this.query, {
        search: string
    });
    var data = {
        url: this.url,
        method: 'GET', // or any http method
        qs: this.query
    };

    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(data)
                .then(function(resp){
                    var result = cb(resp.data);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject({statusCode: 422 , message: err});
                });
        });
    };

    return obj;
};

ApiModel.prototype.count = function(query){
    this.query = {};
    this.query = _.extend(this.query, query);
    var data = {
        url: this.url,
        method: 'GET', // or any http method
        qs: this.query
    };

    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(data)
                .then(function(resp){
                    var result = cb(resp.totalResult);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject({statusCode: 422 , message: err});
                });
        });
    };

    return obj;
};


ApiModel.prototype.estimatedDocumentCount = function(query){
    return this.count(query);
};


ApiModel.prototype.find = function(query){
    if(!query){
        query = {};
    }

    if(query.createdAt && query.createdAt.$gt){
        query.from = query.createdAt.$gt;
        delete query.createdAt.$gt;
    }

    if(query.createdAt && query.createdAt.$lt){
        query.to = query.createdAt.$lt;
        delete query.createdAt.$lt;
    }

    if(query.createdAt){
        delete query.createdAt;
    }

    if(query._id && query._id.$gt){
        query.lastId = query._id.$gt;
        delete query._id.$gt;
    }

    this.query = {};
    this.query = _.extend(this.query, query);
    var data = {
        url: this.url,
        method: 'GET', // or any http method
        qs: this.query
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(data)
                .then(function(resp){
                    var result = cb(resp.data);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject({statusCode: 422 , message: err});
                });
        });
    };

    return obj;
};

ApiModel.prototype.findOne = function(query){
    if(!query){
        query = {};
    }

    if(query.createdAt && query.createdAt.$gt){
        query.from = query.createdAt.$gt;
        delete query.createdAt.$gt;
    }

    if(query.createdAt && query.createdAt.$lt){
        query.to = query.createdAt.$lt;
        delete query.createdAt.$lt;
    }

    if(query._id && query._id.$gt){
        query.lastId = query._id.$gt;
        delete query._id.$gt;
    }

    this.query = {};
    this.query = _.extend(this.query, query);
    var data = {
        url: this.url,
        method: 'GET', // or any http method
        qs: this.query
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(data)
                .then(function(resp){
                    var result = cb(resp.data[0]);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject({statusCode: 422 , message: err});
                });
        });
    };

    return obj;
};

ApiModel.prototype.findOneAndUpdate = function(query, data){
    if(!query){
        query = {};
    }
    this.query = {};
    this.query = _.extend(this.query, query);
    this.data = data;
    if(this.data && this.data._id && typeof this.data._id !== 'string'){
        this.data._id = this.data._id.toString();
    }
    var obj = this;
    return obj.findOne(this.query)
        .then(function(resp){
            debug('to update: ', resp);
            return obj.findByIdAndUpdate(resp._id, obj.data);
        });
};

ApiModel.prototype.findOneAndRemove = function(query){
    if(!query){
        query = {};
    }
    this.query = {};
    this.query = _.extend(this.query, query);
    var obj = this;
    return obj.findOne(this.query)
        .then(function(resp){
            debug('to remove: ', resp);
            return obj.findByIdAndRemove(resp._id);
        });
};

ApiModel.prototype.findById = function(id){
    if(!id){
        throw {statusCode: 400 , message: 'Stop! You need to pass an ID'};
    }

    if(typeof id !== 'string'){
        throw {statusCode: 400 , message: 'Stop! ID needs to be a string'};
    }

    this.id = id;

    debug('the id id id: ', id);
    this.query = {};
    var data = {
        url: this.url+'/'+this.id,
        method: 'GET',
        qs: this.query
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(data)
                .then(function(resp){
                    debug('what do we have here: ', resp);
                    var result = cb(resp.data);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject(err);
                });
        });
    };

    return obj;
};

ApiModel.prototype.create = function(data){
    if(!data){
        throw {statusCode: 400 , message: 'Stop! You need to pass data'};
    }

    if(typeof data !== 'object'){
        throw {statusCode: 400 , message: 'Stop! Data must be an object'};
    }

    this.data = data;

    if(this.data && this.data._id && typeof this.data._id !== 'string'){
        this.data._id = this.data._id.toString();
    }

    debug('Data: ', this.data);

    var _data = {
        url: this.url,
        method: 'POST', // or any http method
        data: this.data
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(_data)
                .then(function(resp){
                    var result = cb(resp.data);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject(err);
                });
        });
    };

    return obj;
};

ApiModel.prototype.updateMany = function(query, data){
    if(!data){
        throw {statusCode: 400 , message: 'Stop! You need to pass data'};
    }

    if(typeof data !== 'object'){
        throw {statusCode: 400 , message: 'Stop! Data must be an object'};
    }

    data.updatedAt = new Date(Date.now()).toISOString();
    this.data = data;
    if(this.data && this.data._id && typeof this.data._id !== 'string'){
        this.data._id = this.data._id.toString();
    }
    this.query = {};
    this.query = _.extend(this.query, query);

    var _data = {
        url: this.url,
        method: 'PUT', // or any http method
        data: this.data,
        qs: this.query
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(_data)
                .then(function(resp){
                    var result = cb(resp.data);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject(err);
                });
        });
    };

    return obj;
};

ApiModel.prototype.update = function(query, data){
    return this.updateMany(query, data);
};

ApiModel.prototype.findByIdAndUpdate = function(id, data){
    if(!data){
        throw {statusCode: 400 , message: 'Stop! You need to pass data'};
    }

    if(typeof data !== 'object'){
        throw {statusCode: 400 , message: 'Stop! Data must be an object'};
    }

    if(!id){
        throw {statusCode: 400 , message: 'Stop! You need to pass an ID'};
    }

    if(typeof id !== 'string'){
        throw {statusCode: 400 , message: 'Stop! ID needs to be a string'};
    }

    data.updatedAt = new Date(Date.now()).toISOString();
    this.data = data;

    if(this.data && this.data._id && typeof this.data._id !== 'string'){
        this.data._id = this.data._id.toString();
    }
    this.id = id;

    debug('this is what we are sending: ', this.data);
    var _data = {
        url: this.url+'/'+this.id,
        method: 'PATCH', // or any http method
        data: this.data
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(_data)
                .then(function(resp){
                    var result = cb(resp.data);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject(err);
                });
        });
    };

    return obj;
};

ApiModel.prototype.deleteMany = function(query){
    this.query = {};
    this.query = _.extend(this.query, query);

    var _data = {
        url: this.url,
        method: 'DELETE', // or any http method
        qs: this.query
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(_data)
                .then(function(resp){
                    var result = cb(resp.data);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject(err);
                });
        });
    };

    return obj;
};

ApiModel.prototype.findByIdAndRemove = function(id){
    if(!id){
        throw {statusCode: 400 , message: 'Stop! You need to pass an ID'};
    }

    if(typeof id !== 'string'){
        throw {statusCode: 400 , message: 'Stop! ID needs to be a string'};
    }

    this.id = id;

    var _data = {
        url: this.url+'/'+this.id,
        method: 'DELETE'
    };
    var obj = this;
    obj.then = function(cb){
        return q.Promise(function(resolve, reject){
            obj.call(_data)
                .then(function(resp){
                    var result = cb(resp.data);
                    debug('Was deleted: ', resp);
                    return resolve(result);
                })
                .catch(function(err){
                    return reject(err);
                });
        });
    };

    return obj;
};

ApiModel.prototype.deleteOne = function(query){
    if(!query){
        query = {};
    }
    this.query = {};
    this.query = _.extend(this.query, query);
    var obj = this;
    return obj.findOne(this.query)
        .then(function(resp){
            debug('to delete: ', resp);
            return obj.findByIdAndRemove(resp._id);
        });
};

module.exports = ApiModel;
module.exports._mongoose = mongoose;

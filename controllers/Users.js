"use strict";

var Users = require('../models').Users;

var UsersController = {};

UsersController.find = function(query,projection,options){
    return Users.find(query,projection,options);
};

UsersController.findOne = function(id,projection,options){
    return Users.findById(id,projection,options);
};

UsersController.search = function(string){
    return Users.search(string);
};

UsersController.create = function(data){
    return Users.create(data);
};

UsersController.update = function(query, data){
    return Users.update(query,data);
};

UsersController.updateOne = function(id, data){
    return Users.findByIdAndUpdate(id,data);
};

UsersController.delete = function(query){
    return Users.deleteMany(query);
};

UsersController.deleteOne = function(id){
    return Users.findByIdAndRemove(id);
};

UsersController.count = function(query){
    return Users.count(query);
};

UsersController.restore = function(query){
    return Users.count(query);
};

module.exports = UsersController;

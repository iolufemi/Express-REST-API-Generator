"use strict";
var express = require('express');
var router = express.Router();
var usersController = require('../controllers/Users');

var service = 'users';

// get users or search users
router.get('/'+service, usersController.find);

// get user
router.get('/'+service+'/:id', usersController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }

// create user(s) a single user object will create one user while an array of users will create multiple users
router.post('/'+service, usersController.create);

// update all records that matches the query
router.put('/'+service, usersController.updateOne);

// update a single record
router.put('/'+service+'/:id', usersController.findOne);

// delete all records that matches the query
router.delete('/'+service, usersController.delete);

// Delete a single record
router.delete('/'+service+'/:id', usersController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', usersController.restore);

module.exports = router;
// Todo: Test users route

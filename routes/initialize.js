"use strict";
var express = require('express');
var router = express.Router();
var initializeController = require('../controllers/initialize');

// set tag
router.get('/initialize', initializeController.init);

module.exports = router;

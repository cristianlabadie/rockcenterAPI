'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/probando-api', UserController.pruebas);

module.exports = api;

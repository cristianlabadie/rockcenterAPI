'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http


//rutas base
app.get('/prueba', function(req, res){
  res.status(200).send({message: 'Bienvenido al sitio de rockcenter desarrollado por Cristian Moreno.'});
});

module.exports = app;

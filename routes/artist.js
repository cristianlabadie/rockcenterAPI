'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty'); //modulo para recoletar los files.
var md_upload = multipart({uploadDir: './uploads/artists'});//PATH donde se almacenaran las imagenes.
//CRUD de las rutas en la api.
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);//Busca a un artista.
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist); //Almacena al artista
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists); //Lista todos los artistas
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist); //Actualiza al artista
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);//Elimina al artista mediate el ID
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);//Sube imagen al artista
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);//Busca la imagen asociada al artista.


module.exports = api;

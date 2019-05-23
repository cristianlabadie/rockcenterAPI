'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty'); //modulo para recoletar los files.
var md_upload = multipart({uploadDir: './uploads/albums'});//PATH donde se almacenaran las imagenes.

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum); //Almacena el album.
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);//Lista todos los albumes o los de un artista en especifico.
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum); //Actualiza un album por parametro ID.
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);//Sube imagen al album
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);//Busca la imagen asociada al album.



module.exports = api;

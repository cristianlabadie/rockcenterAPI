'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty'); //modulo para recoletar los files.
var md_upload = multipart({uploadDir: './uploads/songs'});//PATH donde se almacenaran las imagenes.

api.get('/song/:id',md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?',md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);//Sube imagen al album
api.get('/get-song-file/:songFile', SongController.getSongFile);//Busca la imagen asociada al album.


module.exports = api;

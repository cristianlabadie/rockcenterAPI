'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
  //res.status(200).send({message: 'Accion getAlbum'});


  var albumId = req.params.id;

  Artist.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
    if(err){
      res.status(500).send({message: 'Error en la petición.'});
    }else{
      if(!album){
        res.status(404).send({message: 'Album no existe.'});
      }else{
        res.status(200).send({album});
      }
    }
  });
}

function saveAlbum(req, res){
  var album = new Album();
  var params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err,albumStored)=>{
    if(err){
      res.status(500).send({message: 'Error en la petición al guardar el Album.'});
    }else{
      if(!albumStored){
        res.status(500).send({message: 'No se pudo almacenar el album.'});
      }else{
        res.status(500).send({album: albumStored});
      }
    }
  });


}




module.exports = {
  getAlbum,
  saveAlbum
};

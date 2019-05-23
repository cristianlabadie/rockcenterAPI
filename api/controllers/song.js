'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
    // res.status(200).send({message: 'Ruta de la api a las canciones correcta.'});
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{
      if(err){
        res.status(500).send({message: 'Error en la petición.'});
      }else{
        if(!song){
          res.status(404).send({message: 'La canción no existe.'});
          //console.log(album);
        }else{
          res.status(200).send({song});
        }
      }
    });
}

function getSongs(req, res){
  var albumId = req.params.album;

  if(!albumId){
    //Saca todos los albumes de la BD.
    var find = Song.find({}).sort('number');
  }else{
    //Saca los albumes de un artista en concreto.
    var find = Song.find({album: albumId}).sort('number');
  }

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, albums)=>{
    if(err){
      res.status(500).send({message: 'Error en la petición de busqueda.'});
    }else{
      if(!albums){
        res.status(404).send({message: 'Albumes no encontrados.'});
      }else{
        res.status(200).send({albums});
      }
    }
  });
}

function saveSong(req, res){
  var song = new Song();
  var params = req.body;

  song.number = params.number;
  song.name = params.name;
  song.file = 'null';
  song.duration = params.duration;
  song.image = 'null';
  song.album = params.album;

  song.save((err,songStored)=>{
    if(err){
      res.status(500).send({message: 'Error en la petición al guardar la Canción.'});
    }else{
      if(!songStored){
        res.status(500).send({message: 'No se pudo almacenar la Canción.'});
      }else{
        res.status(500).send({song: songStored});
      }
    }
  });


}

function updateSong(req, res){
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, function(err, songUpdated){
    if(err){
      res.status(500).send({message: 'Error en la petición de actualización.'});
    }else{
      if(!songUpdated){
        res.status(404).send({message: 'No se ha podido actualizar la canción.'});
      }else{
        res.status(200).send({song: songUpdated});
      }
    }
  });
}

function deleteSong(req, res){
  var songId = req.params.id;
  Song.findByIdAndRemove(songId, (err, songRemoved)=>{
    if(err){
      res.status(500).send({message: 'Error en la peticición de eliminación.'});
    }else{
      if(!songRemoved){
        res.status(404).send({message: 'Error al borrar la cancación.'});
      }else{
        res.status(200).send({song: songRemoved});
      }
    }
  });
}

function uploadFile(req, res){
  var songId = req.params.id;
  var file_name = 'No ha subido...';

  if(req.files){
    var file_path = req.files.file.path;
    var file_ext = path.extname(file_path);
    var file_name  = path.basename(file_path);
    //var file_path = req.files.image.path;
    //var file_split = file_path.split('\\', 2);
    //var file_name = file_split;

    //var ext_split = file_name.split('.', 1);
    //var file_ext = ext_split;
    console.log(file_ext);
    if(file_ext == '.mp3' || file_ext == '.ogg'){
      Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated)=>{
        if(!songUpdated){
          res.status(404).send({message:'No se ha podido actualizar la canción.'});
        }else{
          res.status(200).send({song: songUpdated});
        }
      });
    }else{
      res.status(200).send({message: 'Extensión de la imagen incorrecta.'});
    }
  }else{
    res.status(200).send({message: 'No has subido ninguna imagen.'});
  }
}

function getSongFile(req, res){
  var songfile = req.params.songFile;
  var path_file = './uploads/songs/'+songfile;

  fs.exists(path_file, function(exists){
    if(exists){

      res.sendFile(path.resolve(path_file));
    }else{
      console.log(songfile);
      res.status(200).send({message: 'No existe la cancion.'});
    }
  });
}

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
};

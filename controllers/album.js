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

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
    if(err){
      res.status(500).send({message: 'Error en la petición.'});
    }else{
      if(!album){
        res.status(404).send({message: 'Album no existe.'});
        //console.log(album);
      }else{
        res.status(200).send({album});
      }
    }
  });
}

function getAlbums(req, res){
  var artistId = req.params.artist;

  if(!artistId){
    //Saca todos los albumes de la BD.
    var find = Album.find({}).sort('title');
  }else{
    //Saca los albumes de un artista en concreto.
    var find = Album.find({artist: artistId}).sort('year');
  }

  find.populate({path: 'artist'}).exec((err, albums)=>{
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

function updateAlbum(req, res){
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, function(err, albumUpdated){
    if(err){
      res.status(500).send({message: 'Error en la petición de actualización'});
    }else{
      if(!albumUpdated){
        res.status(404).send({message: 'El album no se ha podido actualizar.'});
      }else{
        res.status(200).send({album: albumUpdated});
      }
    }
  });
}

function deleteAlbum(req, res){
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, function(err, albumRemoved){
    if(err){
      res.status(500).send({message: 'Error en la petición de eliminación de album.'});
    }else{
      if(!albumRemoved){
        res.status(404).send({message: 'El album no ha sido eliminiado.'});
      }else{
        Song.find({album: albumRemoved._id}).remove(function(err, songRemoved){
          if(err){
            res.status(500).send({message: 'Error en la petición de eliminación de la canción.'});
          }else{
            if(!albumRemoved){
              res.status(404).send({message: 'La canción no ha sido eliminiado.'});
            }else{
              res.status(200).send({album: albumRemoved});
            }
        }});
      }
    }
  });
}

function uploadImage(req, res){
  var albumId = req.params.id;
  var file_name = 'No ha subido...';

  if(req.files){
    var file_path = req.files.image.path;
    var file_ext = path.extname(file_path);
    var file_name  = path.basename(file_path,file_ext);
    //var file_path = req.files.image.path;
    //var file_split = file_path.split('\\', 2);
    //var file_name = file_split;

    //var ext_split = file_name.split('.', 1);
    //var file_ext = ext_split;
    console.log(file_ext);
    if(file_ext == '.png' || file_ext == '.jpeg' || file_ext == '.gif' || file_ext == '.jpg'){
      Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated)=>{
        if(!albumUpdated){
          res.status(404).send({message:'No se ha podido actualizar al artista.'});
        }else{
          res.status(200).send({album: albumUpdated});
        }
      });
    }else{
      res.status(200).send({message: 'Extensión de la imagen incorrecta.'});
    }
  }else{
    res.status(200).send({message: 'No has subido ninguna imagen.'});
  }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/albums/'+ imageFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe la imagen.'});
    }
  });
}



module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};

'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) =>{
    if(err){
      res.status(500).send({message: 'Error en la petición.'});
    }else{
      if(!artist){
        res.status(404).send({message: 'Artista no existe.'});
      }else{
        res.status(200).send({artist});
      }
    }
  });



}

function getArtists(req, res){
  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }

  var itemPerPage = 5;

  Artist.find().sort('name').paginate(page, itemPerPage, function(err, artists, total){
    if(err){
      res.status(500).send({message: 'Error en la petición.'});
    }else{
      if(!artists){
        res.status(404).send({message: 'No se han encontrado artistas.'});
      }else{
        return res.status(200).send({
          total: total,
          artists: artists
        });
      }
    }
  });
}

function saveArtist(req, res){
  var artist = new Artist();
  var params = req.body;

  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored)=>{
    if(err){
      res.status(500).send({message: 'Error al guardar el artista.'});
    }else{
      if(!artistStored){
        res.status(404).send({message: 'El artista no ha sido guardado.'});
      }else{
        res.status(200).send({artist: artistStored});
      }
    }
  });
}

function updateArtist(req, res){
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, function(err, artistUpdated){
    if(err){
      res.status(500).send({message: 'Error en la petición de actualización.'});
    }else{
      if(!artistUpdated){
        res.status(404).send({message: 'Artista no actualizado.'});
      }else{
        res.status(200).send({artist: artistUpdated});
      }
    }
  });
}

function deleteArtist(req, res){
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, function(err, artistRemoved){
    if(err){
      res.status(500).send({message: 'Error en la petición de eliminación del artista.'});
    }else{
      if(!artistRemoved){
        res.status(404).send({message: 'Artista no encontrado.'});
      }else{
        Album.find({artist: artistRemoved._id}).remove(function(err, albumRemoved){
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
                    res.status(200).send({artist: artistRemoved});
                  }
              }});
            }
          }
        });
      }
    }

  });
}

function uploadImage(req, res){
  var artistId = req.params.id;
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
      Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated)=>{
        if(!artistUpdated){
          res.status(404).send({message:'No se ha podido actualizar al artista.'});
        }else{
          res.status(200).send({artist: artistUpdated});
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
  var path_file = './uploads/artists/'+ imageFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe la imagen.'});
    }
  });
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};

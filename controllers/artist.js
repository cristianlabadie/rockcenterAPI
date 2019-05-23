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

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist
};

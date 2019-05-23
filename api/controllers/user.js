'use strict'
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var path = require('path');

function pruebas(req, res){
  res.status(200).send({
    message:"Realizando pruebas de la API Rest con nodejs y mongodb."
  });
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = params.role;
    user.image = 'null';

    if(params.password){
      //encriptar la contraseña y guardar en la bs mongoose
      bcrypt.hash(params.password, null, null, function(err, hash){
        user.password = hash;

        if(user.name != null && user.surname != null && user.email != null){
          //guarda el usuario
          user.save((err, userStored) =>{
            if(err){
              res.status(500).send({message:'Error al guardar el usuario.'});
            }else{
              if(!userStored){
                res.status(404).send({message:'No se ha registrado el usuario.'});
              }else{
                res.status(200).send({user: userStored});
              }
            }
          });
        }else{
          res.status(200).send({message:'Introduce todos los campos solicitados.'});
        }
      });
    }else{
      res.status(200).send({message:'Introduce una contraseña.'});
    }
}

function loginUser(req, res){
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) =>{
    if(err){
      res.status(500).send({message:'Error en la petición.'});
    }else{
      if(!user){
        res.status(404).send({message:'Usuario no existe.'});
      }else{
        //comprobar la contraseña
        bcrypt.compare(password, user.password, function(err, check){
          if(check){
            //devuelve los datos del usuario.
            if(params.gethash){
              //devolvera el token JWT
              res.status(200).send({
                token: jwt.createToken(user)
              });
            }else{
              res.status(200).send({user});
            }
          }else{
            res.status(200).send({message:'El usuario no ha podido logearse'});
          }
        });
      }
    }
  });

}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
    if(err){
      res.status(500).send({message:'Error al actualizar el usuario'});
    }else{
      if(!userUpdated){
        res.status(404).send({message:'No se ha podido actualizar el usuario.'});
      }else{
        res.status(200).send({user: userUpdated});
      }
    }
  });
}

function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.image.path;
    var file_ext = path.extname(file_path);
    var file_name  = path.basename(file_path);
    //var file_path = req.files.image.path;
    //var file_split = file_path.split('\\', 2);
    //var file_name = file_split;

    //var ext_split = file_name.split('.', 1);
    //var file_ext = ext_split;
    console.log(file_ext);
    if(file_ext == '.png' || file_ext == '.jpeg' || file_ext == '.gif' || file_ext == '.jpg'){
      User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{
        if(!userUpdated){
          res.status(404).send({message:'No se ha podido actualizar el usuario.'});
        }else{
          res.status(200).send({image: file_name,user: userUpdated});
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
  var path_file = './uploads/users/'+ imageFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe la imagen.'});
    }
  });
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};

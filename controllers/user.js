'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

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
    user.role = 'ROLE_ADMIN';
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

module.exports = {
  pruebas,
  saveUser,
  loginUser
};
'use strict'

function pruebas(req, res){
  res.status(200).send({
    message:"Realizando pruebas de la API Rest con nodejs y mongodb."
  });
}

module.exports = {
  pruebas
};

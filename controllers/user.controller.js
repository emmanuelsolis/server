// importamos el modelo
const User = require("../models/User.model");
const { clearRes } = require("../utils/utils");
const mongoose = require("mongoose");

exports.getLoggedUser = (req, res, next) => {
    //User.findById(req.user.id)
    res.status(200).json({user: req.user});
}

exports.editProfile = (req, res, next) => {
    //destructuramos el rol para evitar que lo cambien
    const {role, ...restUser} = req.body;
    //voy a destructurar el id del usuario del req.user
    const {_id} = req.user;
    User.findByIdAndUpdate(_id, {...restUser}, {new: true})
    .then(user => {
        const newUser = clearRes(user.toObject())
        res.status(200).json({user:newUser})

    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "El correo ya esta registrado, por favor intenta con otro correo"
                
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}
//http://wwww.tinderPerritos.com/api/user/6478a5459w03893jd7837/profile
//params
//query String ? key=perritop
exports.getUserById = (req, res, next) => {
    const { id } = req.params

    User.findById(id)
    .then(user => {
        const newUser = clearRes(user.toObject())
        res.status(200).json({ user: newUser })
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "El correo ya esta registrado, por favor intenta con otro correo"
                
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}

//Esta es para el Admin
exports.onlyAdminRead = (req, res, next) => {

    User.find({ role: {$ne:"Admin"}}, {password:0, __v:0, createdAt:0, updatedAt:0}) 
    .then(users => {
        res.status(200).json({ users })
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:"Hubo un error"
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}

//Borrar la cuenta del Ususario logeado
exports.deleteAccount = (req, res, next) => {
    //destructurar el req.user
    const {_id} = req.user
    User.findByIdAndRemove(_id)
    .then(user => {
        res.clearCookie("headload")
        res.clearCookie("signature")
        res.status(200).json({successMessage: "Usuario borrado"})
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "El correo ya esta registrado, por favor intenta con otro correo"
                
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}
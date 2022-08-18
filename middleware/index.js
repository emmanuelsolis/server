//aqui vamos acrear uno que verifique si el usuario esta logeado y ademas que otro verifique si el usuario esta logeado
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const {clearRes} = require("../utils/utils");


exports.verifyToken = (req, res, next) => {
    //1.Vamos a destructuras los cookies
    const {headload, signature} = req.cookies;
    if(!headload || !signature) return res.status(401).json({errorMessage: "No estas autorizado"});
   
    //jwt.verify(jwt, secret, (err,decoded))
    jwt.verify(`${headload}.${signature}`, process.env.JWT_SECRET, (error, decoded) => {
        if(error){
            return res.status(401).json({errorMessage: "No estas autorizado"});
        }
         //decoded = { userID,roles, email,...}
    //findById
    User.findById(decoded.userId)
    .then(user => {
        req.user = clearRes(user.toObject());
        next();//da paso a mi siguienre accion en mi ruta
    })
    .catch(error => {
        res.status(401).json({errorMessage: "peluquin"});
    })//<-end VerifyToken
    })
   
}
        //["Admin"] || ["Staf", "Admin"]
exports.checkRole = (arrayRoles) => {
    return (req, res, next) => {
      //voy a sacar el rol del usuario del req.user
      const {role} = req.user;
      //validar si esta ese rol en el arreglo
      if(arrayRoles.includes(role)){
          next();
      }else {
            res.status(401).json({errorMessage: "No tienes permiso para realizar esta accion"});
      }
    }
}
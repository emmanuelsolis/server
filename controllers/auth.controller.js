const router = require("express").Router();

//importar el modelo de usuario
const User = require("../models/User.model");
const mongoose = require("mongoose");

//para el password
const bcryptjs = require("bcryptjs");
const {clearRes, createJWT} = require("../utils/utils");
//login,signup,logout

//api mandamos data en post
//get solo llamamos data

exports.signupProcess = (req, res, next) => {
    //params :id
    //frontend al back en el body
 //vamos a sacar el role
 const {role, email, password, confirmPassword,...resUser} = req.body;
 if (!email.length || !password.length || !confirmPassword.length) return res.status(400).json({ errorMessage: "No debes mandar campos vacios!" });
 if (password != confirmPassword) return res.status(400).json({ errorMessage: "La contraseñas no son iguales!" });
 const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
 if (!regex.test(password)) return res.status(400).json({errorMessage:"La contraseña neceista tener almenos una minuscula, una mayuscula y un numero"})

 const found = await User.findOne({ email })
 if(found) return res.status(400).json({ errorMessage: "Ese correo ya fue tomado!" });

    // //validar que los campos no esten vacios
    // if(!email.length || !password.length || !confirmPassword.length)return res.status(400).json({errorMessage: "No debes mandar campos vacios!"});
    // //validar que las contraseñas sean iguales
    // if(password !== confirmPassword) return res.status(400).json({errorMessage: "Las contraseñas no coinciden!"});
    // //validar si existe email 1.1
        //{email: email} > {email:dylan.etc...}
    User.findOne({email})
    .then(foundedUser => {
        //validar email 1.2
        if(foundedUser) return res.status(400).json({errorMessage:"Este correo ya esta registrado!"});

      return bcryptjs.genSalt(10)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            //ceraremos un nuevo usuario
            return User.create({email, password: hashedPassword, ...resUser})
        })
        //tehn contiene al user ya con password hashed y guardado en db
        .then(user => {
            //regresamos al ususario para que enetre a la pagina y creamos su token de acceso
            const [ header, payload, signature ] = createJWT(user);
            //vamos a guardar estos datos en las cookies 
            //res.cookie("Key_como se va aguardar", "valor: dato qye voy a  almacenar", opciones:{expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)})
            res.cookie("headload", `${header}.${payload}`, {
                maxAge: 1000 * 60 * 30,
                httpOnly: true,
                sameSite: "strict",
                secure:false
            })
            res.cookie("signature", signature, {
                maxAge: 1000 * 60 * 30,
                httpOnly: true,
                sameSite: "strict",
                secure:false
            })
            /* user ={
                firstName: "Dylan",
                lastName: "Etc",
                email: "
                password: "123456789"
                }
                toObject()
                {}Objeto || JSON
                {}BSON => toObject() Objeto ..., {perro, gato, etc}
            } */
            /* res en el frontend
            res.data = {
                result: {
                    user: {
                        _id: "5e9f8f8f8f8f8f8f8f8f8f8",
                        email: "email@example.com
                        listFriends: [{..},{..}]
                    },
                }
                }
            } */
            //vamos a limpiar la respuesta de mongoose conviertiendo la respues del BSON a objeto y eliminando data basura
            const newUser = clearRes(user.toObject());
            res.status(200).json({user: newUser});//{data: {result: {user:{}}}}
        })
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

exports.loginProccess = (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password || !email.length || !password.length) { return res
        .status(400)
        .json({ errorMessage: "No debes mandar campos vacios!" });
    }
    //validar password > 8 caracteres el regex
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        if (!regex.test(password)) return res.status(400).json({errorMessage:"La contraseña neceista tener almenos una minuscula, una mayuscula y un numero"})
    User.findOne({email})
    .then(foundedUser => {
        //ver si el correo existe
        if(!foundedUser) return res
            .status(400)
            .json({ errorMessage: "Credenciales invalidas!" });
            //ver si la contraseña es correcta
            return bcryptjs.compare(password, foundedUser.password)
            .then(isMatch => {
                if(!isMatch) return res
                    .status(400)
                    .json({ errorMessage: "Credenciales invalidas!" });
                //crear el JWT token
                const [ header, payload, signature ] = createJWT(foundedUser);
                //guardar en las cookies
                res.cookie("headload", `${header}.${payload}`, {
                    maxAge: 1000 * 60 * 30,
                    httpOnly: true,
                    sameSite: "strict",
                    secure:false
                })
                res.cookie("signature", signature, {
                    maxAge: 1000 * 60 * 30,
                    httpOnly: true,
                    sameSite: "strict",
                    secure:false
                })
                //retornar al frontend
                //vamos a limpiar la respuesta de mongoose conviertiendo la respues del BSON a objeto y eliminando data basura
                const newUser = clearRes(foundedUser.toObject());
                res.status(200).json({user: newUser});
            
        })
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

exports.logoutProccess = (req, res, next) => {
    res.clearCookie("headload");
    res.clearCookie("signature");
    res.status(200).json({successMessage: "Saliste todo chido regresa pronto :D!"});
}
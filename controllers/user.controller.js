// importamos el modelo
const User = require("../models/User.model");
const { clearRes } = require("../utils/utils");


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
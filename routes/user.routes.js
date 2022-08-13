const router = require("express").Router();
//importar el controlador
const {getLoggedUser, editProfile}  = require("../controllers/user.controller");
//importar middlewares
const {verifyToken} = require("../middleware")
//CRUD

//Read
router.get("/my-profile", verifyToken, getLoggedUser);

//Update
router.patch("/edit-profile", verifyToken, editProfile);

//Delete
//router.delete("/delete-user",)


//Read - Otro Usuario
// router.get("/:id/profile", );




module.exports = router;
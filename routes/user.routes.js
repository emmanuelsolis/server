const router = require("express").Router();
//importar el controlador
const {getLoggedUser, editProfile,onlyAdminRead, deleteAccount, getUserById}  = require("../controllers/user.controller");
//importar middlewares
const {verifyToken, checkRole} = require("../middleware")
//CRUD

//Read
router.get("/my-profile", verifyToken, getLoggedUser);

//Update
router.patch("/edit-profile", verifyToken, editProfile);

//Delete
router.delete("/delete-user", verifyToken, deleteAccount);


//Read - Otro Usuario
router.get("/:id/profile",verifyToken,getUserById)


//Read  all users (ADMIN STAFF)
//router.get("/admin/users")
router.get("/admin/users", verifyToken, checkRole(["Admin"]), onlyAdminRead)




module.exports = router;
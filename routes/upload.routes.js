const router = require("express").Router();

//importar el controlador 
const { uploadProcess} = require("../controllers/upload.controller")
//helper
const uploadCloud = require("../helpers/cloudinary")

//multiples
router.post ("/uploads", uploadCloud.array("images", 3), uploadProcess)
//una sola







module.exports = router;

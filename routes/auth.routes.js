const router = require("express").Router();
//importar el controlador
const { signupProcess, loginProccess, logoutProccess } = require("../controllers/auth.controller");
//middlewares

router.post("/signup", signupProcess);

router.post("/login", loginProccess)

router.get("/logout", logoutProccess)

module.exports = router;
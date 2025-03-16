const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");


// Rutas de usuarios
router.post("/register", userController.register); // Registro de usuario
router.get("/get", userController.getUsers); // Obtener todos los usuarios

module.exports = router;

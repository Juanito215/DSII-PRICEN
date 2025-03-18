const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Rutas de usuarios
router.post("/register", userController.register); // Registro de usuario
router.get("/get", userController.getUsers); // Obtener todos los usuarios
router.post("/login", userController.login); // Login
router.get("/perfil", verifyToken, userController.getProfile); // Obtener perfil de usuario
router.put("/:id", verifyToken, userController.updateUser); // Actualizar usuario
module.exports = router;

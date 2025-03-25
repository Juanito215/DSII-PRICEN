const express = require("express");
const router = express.Router();
const usuarioProductoController = require("../controllers/UsuarioProductoController");
const { verifyToken } = require("../middlewares/authMiddleware"); // Protegemos rutas

// 🔹 Rutas para la lista de productos del usuario
router.post("/", verifyToken, usuarioProductoController.agregarProducto);
router.get("/", verifyToken, usuarioProductoController.obtenerLista);
router.put("/:id", verifyToken, usuarioProductoController.actualizarCantidad);
router.delete("/:id", verifyToken, usuarioProductoController.eliminarProducto);

module.exports = router;
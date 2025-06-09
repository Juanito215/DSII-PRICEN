const express = require("express");
const router = express.Router();
const usuarioProductoController = require("../controllers/UsuarioProductoController");
const { verifyToken } = require("../middlewares/authMiddleware"); // Protegemos rutas

// 🔹 Rutas para la lista de productos del usuario
router.post("/", verifyToken, usuarioProductoController.agregarProducto);
router.get("/", verifyToken, usuarioProductoController.obtenerLista);
router.get("/buscar", verifyToken, usuarioProductoController.buscarProductoPorNombre);
router.get('/:usuarioId', verifyToken, usuarioProductoController.obtenerProductosPorUsuario);
router.put("/:id", verifyToken, usuarioProductoController.actualizarCantidad);
router.delete("/:usuarioId/:productoId", verifyToken, usuarioProductoController.eliminarProductoPorIds);
module.exports = router;
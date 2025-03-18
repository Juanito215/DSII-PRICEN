const express = require("express");
const router = express.Router();
const supermercadoController = require("../controllers/SupermercadoController");
const { verifyToken } = require("../middlewares/authMiddleware"); // Protegemos rutas

// 🔹 Ruta para registrar un supermercado (Solo admin)
router.post("/", verifyToken, supermercadoController.createSupermercado);
router.get("/", supermercadoController.getSupermercados); // Obtener todos o buscar por nombre
router.put("/:id", verifyToken, supermercadoController.updateSupermercado); // Actualizar supermercado
router.delete("/:id", verifyToken, supermercadoController.deleteSupermercado); // Eliminar supermercado

module.exports = router;

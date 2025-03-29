const express = require("express");
const router = express.Router();
const precioController = require("../controllers/PrecioController");
const { verifyToken } = require("../middlewares/authMiddleware"); // Protegemos rutas

// 🔹 Rutas para precios
router.post("/", verifyToken, precioController.createPrecio);
router.get("/", precioController.getPrecios);
router.get("/:producto_id", precioController.getPreciosPorProducto);
router.put("/", verifyToken, precioController.reportarPrecio); // Solo admin

module.exports = router;

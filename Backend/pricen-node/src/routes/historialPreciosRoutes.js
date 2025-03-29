const express = require("express");
const router = express.Router();
const historialPreciosController = require("../controllers/historialPreciosController");

// 📌 Ruta para obtener el historial de precios de un producto específico
router.get("/:producto_id", historialPreciosController.obtenerHistorialPorProducto);

module.exports = router;

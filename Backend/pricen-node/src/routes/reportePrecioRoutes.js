const express = require("express");
const router = express.Router();
const reportesPreciosController = require("../controllers/ReportePrecioController");
const { verifyToken } = require("../middlewares/authMiddleware");

// 📌 Ruta para obtener los reportes de precios de un producto específico
// POST /reportes_precios
router.post("/", verifyToken, reportesPreciosController.reportarPrecio);
router.get("/:producto_id", reportesPreciosController.obtenerReportesPorProducto);

module.exports = router;

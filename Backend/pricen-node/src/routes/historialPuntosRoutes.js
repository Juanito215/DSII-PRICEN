const express = require("express");
const router = express.Router();
const {
    obtenerHistorialPuntos,
    obtenerTotalPuntos
} = require("../controllers/HistorialPuntosController");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Ruta para obtener el historial de puntos de un usuario
router.get("/historial", verifyToken, obtenerHistorialPuntos);

// ✅ Ruta para obtener el total de puntos acumulados por un usuario
router.get("/total", verifyToken, obtenerTotalPuntos);

module.exports = router;

// src/routes/recompensas.routes.js
const express = require("express");
const router = express.Router();
const RecompensaController = require("../controllers/recompensaController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Rutas para recompensas
router.post("/", verifyToken, RecompensaController.crearRecompensa);       // Admin
router.get("/", RecompensaController.obtenerRecompensas);                  // Público
router.put("/:id/desactivar", verifyToken, RecompensaController.desactivarRecompensa); // Admin

module.exports = router;

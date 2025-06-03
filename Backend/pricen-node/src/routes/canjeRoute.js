// src/routes/canjeRoute.js
const express = require("express");
const router = express.Router();
const canjeController = require("../controllers/canjeController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, canjeController.realizarCanje);
router.get("/historial", verifyToken, canjeController.historialCanjes);

module.exports = router;

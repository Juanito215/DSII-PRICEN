// src/controllers/RecompensaController.js
const Recompensa = require("../models/Recompensa");

// 🔹 Crear recompensa (Solo admin)
exports.crearRecompensa = async (req, res) => {
  try {
    if (!req.user || req.user.rol !== 'admin') {
      return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }

    const { nombre, descripcion, puntos_necesarios } = req.body;
    if (!nombre || !puntos_necesarios) {
      return res.status(400).json({ message: "Nombre y puntos necesarios son requeridos." });
    }

    const recompensa = await Recompensa.create({
      nombre,
      descripcion,
      puntos_necesarios,
    });

    res.status(201).json({ message: "Recompensa creada exitosamente.", recompensa });
  } catch (error) {
    console.error("Error al crear recompensa:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// 🔹 Obtener todas las recompensas disponibles
exports.obtenerRecompensas = async (req, res) => {
  try {
    const recompensas = await Recompensa.findAll({
      where: { disponible: true }
    });
    res.json(recompensas);
  } catch (error) {
    console.error("Error al obtener recompensas:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// 🔹 Desactivar recompensa (admin)
exports.desactivarRecompensa = async (req, res) => {
  try {
    if (!req.user || req.user.rol !== 'admin') {
      return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }

    const { id } = req.params;
    const recompensa = await Recompensa.findByPk(id);
    if (!recompensa) return res.status(404).json({ message: "Recompensa no encontrada." });

    recompensa.disponible = false;
    await recompensa.save();

    res.json({ message: "Recompensa desactivada correctamente." });
  } catch (error) {
    console.error("Error al desactivar recompensa:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// src/controllers/canjeController.js
const Canje = require("../models/Canje");
const HistorialPuntos = require("../models/HistorialPuntos");
const Recompensa = require("../models/Recompensa");
const Usuario = require("../models/Usuario");

// 🔹 Registrar un canje
exports.realizarCanje = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { recompensa_id } = req.body;

    const recompensa = await Recompensa.findByPk(recompensa_id);
    if (!recompensa || !recompensa.disponible) {
      return res.status(400).json({ message: "Recompensa no válida o no disponible." });
    }

    // Calcular puntos actuales desde historial
    const totalPuntos = await HistorialPuntos.sum("puntos", {
      where: { usuario_id },
    }) || 0;

    if (totalPuntos < recompensa.puntos_necesarios) {
      return res.status(400).json({ message: "No tienes suficientes puntos para esta recompensa." });
    }

    // Registrar el canje
    const nuevoCanje = await Canje.create({ usuario_id, recompensa_id });

    // Registrar el descuento de puntos en historial
    await HistorialPuntos.create({
      usuario_id,
      descripcion: `Canjeó recompensa: ${recompensa.nombre}`,
      puntos: -recompensa.puntos_necesarios,
    });

    res.status(201).json({ message: "Recompensa canjeada exitosamente.", nuevoCanje });
  } catch (error) {
    console.error("❌ Error al canjear recompensa:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};


// 🔹 Obtener historial de canjes de un usuario
exports.historialCanjes = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const canjes = await Canje.findAll({
      where: { usuario_id },
      include: { model: Recompensa, attributes: ["nombre", "descripcion"] },
      order: [["fecha_canje", "DESC"]],
    });

    res.json(canjes);
  } catch (error) {
    console.error("❌ Error al obtener historial de canjes:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

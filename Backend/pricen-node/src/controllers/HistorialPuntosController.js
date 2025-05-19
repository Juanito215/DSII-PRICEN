const HistorialPuntos = require("../models/HistorialPuntos");
const Usuario = require("../models/Usuario");

// ✅ Obtener historial de puntos de un usuario
exports.obtenerHistorialPuntos = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Buscar historial de puntos ordenado por fecha
        const historial = await HistorialPuntos.findAll({
            where: { usuario_id: usuarioId },
            order: [["fecha", "DESC"]],
        });

        res.json(historial);
    } catch (error) {
        console.error("❌ Error al obtener historial de puntos:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// ✅ Agregar puntos al historial de un usuario
exports.agregarPuntos = async (usuarioId, puntos, descripcion) => {
    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            console.error("❌ Usuario no encontrado al intentar agregar puntos.");
            return null;
        }

        // Registrar los puntos en el historial
        const nuevoRegistro = await HistorialPuntos.create({
            usuario_id: usuarioId,
            puntos,
            descripcion,
        });

        console.log(`✅ Se agregaron ${puntos} puntos a ${usuario.nombre}.`);
        return nuevoRegistro;
    } catch (error) {
        console.error("❌ Error al agregar puntos al historial:", error);
        return null;
    }
};

// ✅ Obtener el total de puntos acumulados por un usuario
exports.obtenerTotalPuntos = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Calcular el total de puntos sumando todos los registros
        const totalPuntos = await HistorialPuntos.sum("puntos", {
            where: { usuario_id: usuarioId },
        });

        res.json({ usuarioId, totalPuntos: totalPuntos || 0 });
    } catch (error) {
        console.error("❌ Error al obtener el total de puntos:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

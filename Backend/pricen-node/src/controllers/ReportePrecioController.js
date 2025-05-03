const ReportePrecio = require("../models/ReportePrecio");
const Producto = require("../models/Producto");
const Supermercado = require("../models/Supermercado");
const { agregarPuntos } = require("./HistorialPuntosController");

exports.reportarPrecio = async (req, res) => {
    try {
        const { producto_id, supermercado_id, precio_reportado } = req.body;
        const usuario_id = req.user.id;

        if (!producto_id || !supermercado_id || !precio_reportado) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const producto = await Producto.findByPk(producto_id);
        const supermercado = await Supermercado.findByPk(supermercado_id);

        if (!producto || !supermercado) {
            return res.status(404).json({ message: "Producto o supermercado no encontrado." });
        }

        // Crear reporte en la tabla `reportes_precios`
        const nuevoReporte = await ReportePrecio.create({
            producto_id,
            supermercado_id,
            usuario_id,
            precio_reportado
        });

        await agregarPuntos(usuario_id, 10, "Reportó un nuevo precio");

        res.status(201).json({
            message: "✅ Precio reportado exitosamente.",
            nuevoReporte
        });
    } catch (error) {
        console.error("❌ Error al reportar precio:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

exports.obtenerReportesPorProducto = async (req, res) => {
    try {
        const { producto_id } = req.params;

        const reportes = await ReportePrecio.findAll({
            where: { producto_id },
            order: [["fecha_reporte", "DESC"]],
        });

        if (reportes.length === 0) {
            return res.status(404).json({ message: "No hay reportes para este producto." });
        }

        res.status(200).json(reportes);
    } catch (error) {
        console.error("❌ Error al obtener reportes de precios:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

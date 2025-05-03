const ReportePrecio = require("../models/ReportePrecio");

exports.calcularPrecioMasFrecuente = async (producto_id, supermercado_id) => {
    try {
        const reportes = await ReportePrecio.findAll({
            where: { producto_id, supermercado_id },
            attributes: ["precio"],
        });

        if (reportes.length === 0) return null;

        // Contar la frecuencia de cada precio reportado
        const frecuencia = {};
        reportes.forEach(({ precio }) => {
            frecuencia[precio] = (frecuencia[precio] || 0) + 1;
        });

        // Determinar el precio más frecuente
        let precioMasFrecuente = null;
        let maxFrecuencia = 0;

        for (const [precio, count] of Object.entries(frecuencia)) {
            if (count > maxFrecuencia) {
                precioMasFrecuente = parseFloat(precio);
                maxFrecuencia = count;
            }
        }

        return precioMasFrecuente;
    } catch (error) {
        console.error("❌ Error al calcular el precio más frecuente:", error);
        return null;
    }
};

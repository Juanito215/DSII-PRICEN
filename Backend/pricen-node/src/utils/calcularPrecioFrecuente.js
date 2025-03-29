const Precio = require("../models/Precio");
const { Op } = require("sequelize");

exports.calcularPrecioMasFrecuente = async (producto_id, supermercado_id) => {
    try {
        const precios = await Precio.findAll({
            where: { producto_id, supermercado_id },
            attributes: ["precio"],
        });

        if (precios.length === 0) return null;

        // Contar la frecuencia de cada precio reportado
        const frecuencia = {};
        precios.forEach(({ precio }) => {
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

const Precio = require("../models/Precio");
const Producto = require("../models/Producto");
const { calcularPrecioMasFrecuente } = require("../utils/calcularPrecioFrecuente");

exports.actualizarPrecios = async () => {
    try {
        console.log("🔄 Iniciando actualización semanal de precios...");

        // Obtener todos los productos
        const productos = await Producto.findAll();

        for (const producto of productos) {
            const supermercados = await Precio.findAll({
                where: { producto_id: producto.id },
                attributes: ["supermercado_id"],
                group: ["supermercado_id"],
            });

            for (const { supermercado_id } of supermercados) {
                const nuevoPrecio = await calcularPrecioMasFrecuente(producto.id, supermercado_id);

                if (nuevoPrecio !== null && nuevoPrecio !== producto.precio_actual) {
                    await producto.update({ precio_actual: nuevoPrecio });
                    console.log(`✅ Precio actualizado: ${producto.nombre} en supermercado ${supermercado_id} → $${nuevoPrecio}`);
                }
            }
        }

        console.log("✅ Actualización de precios completada.");
    } catch (error) {
        console.error("❌ Error al actualizar precios:", error);
    }
};

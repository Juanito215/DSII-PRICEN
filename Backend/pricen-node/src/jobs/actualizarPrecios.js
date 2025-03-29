const Precio = require("../models/Precio");
const Producto = require("../models/Producto");
const { calcularPrecioMasFrecuente } = require("../utils/calcularPrecioFrecuente");

exports.actualizarPrecios = async () => {
    try {
        console.log("🔄 Iniciando actualización semanal de precios...");

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
                    console.log(`✅ Precio actualizado: ${producto.nombre} → $${nuevoPrecio}`);

                    // ✅ Revisar si hay usuarios que reportaron este mismo precio y darles 50 puntos
                    const usuariosGanadores = await Precio.findAll({
                        where: {
                            producto_id: producto.id,
                            supermercado_id,
                            precio: nuevoPrecio,
                        },
                        attributes: ["usuario_id"],
                    });

                    for (const { usuario_id } of usuariosGanadores) {
                        await HistorialPuntosController.registrarPuntos(usuario_id, "Precio validado", 50);
                    }
                }
            }
        }

        console.log("✅ Actualización de precios completada.");
    } catch (error) {
        console.error("❌ Error al actualizar precios:", error);
    }
};

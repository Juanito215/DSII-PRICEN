const ReportePrecio = require("../models/ReportePrecio");
const Producto = require("../models/Producto");
const { calcularPrecioMasFrecuente } = require("../utils/calcularPrecioFrecuente");
const HistorialPuntosController = require("../controllers/HistorialPuntosController");

exports.actualizarPrecios = async () => {
    try {
        console.log("🔄 Iniciando actualización semanal de precios...");

        const productos = await Producto.findAll();

        for (const producto of productos) {
            const supermercados = await ReportePrecio.findAll({
                where: { producto_id: producto.id },
                attributes: ["supermercado_id"],
                group: ["supermercado_id"],
            });

            for (const { supermercado_id } of supermercados) {
                const nuevoPrecio = await calcularPrecioMasFrecuente(producto.id, supermercado_id);

                if (nuevoPrecio !== null && nuevoPrecio !== producto.precio_actual) {
                    const precioAntiguo = producto.precio_actual;

                    await producto.update({ precio_actual: nuevoPrecio });
                    console.log(`✅ Precio actualizado: ${producto.nombre} en supermercado ${supermercado_id} → de $${precioAntiguo} a $${nuevoPrecio}`);

                    // ✅ Registrar puntos a usuarios que reportaron ese precio
                    const usuariosGanadores = await ReportePrecio.findAll({
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

                    // ✅ (Opcional) Limpiar reportes después de la actualización
                    // await ReportePrecio.destroy({
                    //     where: { producto_id: producto.id, supermercado_id }
                    // });
                }
            }
        }

        console.log("✅ Actualización de precios completada.");
    } catch (error) {
        console.error("❌ Error al actualizar precios:", error);
    }
};

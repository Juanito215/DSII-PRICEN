const HistorialPrecios = require("../models/HistorialPrecios");
const Producto = require("../models/Producto");
const Precio = require("../models/Precio");
const { calcularPrecioMasFrecuente } = require("../utils/calcularPrecioFrecuente");

exports.actualizarPrecios = async () => {
    try {
        console.log("🔄 Iniciando actualización de precios...");

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
                    // ✅ Obtener el precio actual antes de cambiarlo
                    const precioAntiguo = producto.precio_actual;

                    // ✅ Registrar el cambio en historial_precios
                    await HistorialPrecios.create({
                        producto_id: producto.id,
                        supermercado_id,
                        precio_antiguo: precioAntiguo, // Precio antes de la actualización
                        precio_actualizado: nuevoPrecio, // Nuevo precio actualizado
                    });

                    // ✅ Actualizar el precio en el producto
                    await producto.update({ precio_actual: nuevoPrecio });

                    console.log(`✅ Precio actualizado: ${producto.nombre} en supermercado ${supermercado_id} → de $${precioAntiguo} a $${nuevoPrecio}`);
                }
            }
        }

        console.log("✅ Finalización de actualización de precios.");
    } catch (error) {
        console.error("❌ Error al actualizar precios:", error);
    }
};

exports.obtenerHistorialPorProducto = async (req, res) => {
    try {
        const { producto_id } = req.params;

        const historial = await HistorialPrecios.findAll({
            where: { producto_id },
            order: [["fecha_cambio", "DESC"]],
        });

        if (historial.length === 0) {
            return res.status(404).json({ message: "No hay historial de precios para este producto." });
        }

        res.status(200).json(historial);
    } catch (error) {
        console.error("❌ Error al obtener historial de precios:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

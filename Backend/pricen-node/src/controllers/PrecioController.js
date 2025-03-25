const Precio = require("../models/Precio");
const Producto = require("../models/Producto");
const Supermercado = require("../models/Supermercado");
const { op } = require("sequelize");

// 🔹 Registrar un precio (Usuarios autenticados)
exports.createPrecio = async (req, res) => {
    try {
        const { producto_id, supermercado_id, precio } = req.body;
        const usuario_id = req.user.id; // ID del usuario autenticado

        if (!producto_id || !supermercado_id || !precio) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Verificar que el producto y el supermercado existen
        const producto = await Producto.findByPk(producto_id);
        const supermercado = await Supermercado.findByPk(supermercado_id);

        if (!producto || !supermercado) {
            return res.status(404).json({ message: "Producto o supermercado no encontrado." });
        }

        // Crear precio
        const nuevoPrecio = await Precio.create({
            producto_id,
            supermercado_id,
            usuario_id,
            precio,
        });

        res.status(201).json({ message: "Precio registrado exitosamente.", nuevoPrecio });
    } catch (error) {
        console.error("❌ Error al registrar precio:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Obtener todos los precios
exports.getPrecios = async (req, res) => {
    try {
        const precios = await Precio.findAll({
            include: [Producto, Supermercado], // Incluir relaciones
        });
        res.json(precios);
    } catch (error) {
        console.error("❌ Error al obtener precios:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Obtener precios por producto
exports.getPreciosPorProducto = async (req, res) => {
    try {
        const { producto_id } = req.params;
        const precios = await Precio.findAll({
            where: { producto_id },
            include: [Supermercado],
        });

        if (precios.length === 0) {
            return res.status(404).json({ message: "No se encontraron precios para este producto." });
        }

        res.json(precios);
    } catch (error) {
        console.error("❌ Error al obtener precios por producto:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Reportar un nuevo precio de producto
exports.reportarPrecio = async (req, res) => {
    try {
        const { producto_id, supermercado_id, precio } = req.body;
        const usuario_id = req.user.id; // ID del usuario autenticado

        if (!producto_id || !supermercado_id || !precio) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Verificar que el producto y el supermercado existen
        const producto = await Producto.findByPk(producto_id);
        const supermercado = await Supermercado.findByPk(supermercado_id);

        if (!producto || !supermercado) {
            return res.status(404).json({ message: "Producto o supermercado no encontrado." });
        }

        // Guardar el precio reportado en la base de datos
        const nuevoPrecio = await Precio.create({
            producto_id,
            supermercado_id,
            usuario_id,
            precio,
        });

        res.status(201).json({ message: "Precio reportado exitosamente.", nuevoPrecio });
    } catch (error) {
        console.error("❌ Error al reportar precio:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};
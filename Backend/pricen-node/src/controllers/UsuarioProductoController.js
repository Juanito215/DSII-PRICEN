const UsuarioProducto = require("../models/UsuarioProducto");
const Producto = require("../models/Producto");

// 🔹 Agregar un producto al carrito o lista del usuario
exports.agregarProducto = async (req, res) => {
    try {
        const { producto_id, cantidad } = req.body;
        const usuario_id = req.user.id; // ID del usuario autenticado

        if (!producto_id || !cantidad || cantidad < 1) {
            return res.status(400).json({ message: "El producto y la cantidad son obligatorios, y la cantidad debe ser mayor a 0." });
        }

        // Verificar si el producto existe
        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        // Verificar si el producto ya está en la lista del usuario
        let usuarioProducto = await UsuarioProducto.findOne({
            where: { usuario_id, producto_id },
        });

        if (usuarioProducto) {
            // Si ya está en la lista, actualizar la cantidad
            usuarioProducto.cantidad += cantidad;
            await usuarioProducto.save();
            return res.json({ message: "Cantidad actualizada en la lista.", usuarioProducto });
        }

        // Si no está en la lista, agregarlo
        usuarioProducto = await UsuarioProducto.create({
            usuario_id,
            producto_id,
            cantidad,
        });

        res.status(201).json({ message: "Producto agregado a la lista.", usuarioProducto });
    } catch (error) {
        console.error(" Error al agregar producto a la lista:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Obtener la lista de productos de un usuario
exports.obtenerLista = async (req, res) => {
    try {
        const usuario_id = req.user.id; // ID del usuario autenticado

        const lista = await UsuarioProducto.findAll({
            where: { usuario_id },
            include: [Producto], // Incluir información del producto
        });

        res.json(lista);
    } catch (error) {
        console.error("❌ Error al obtener la lista de productos:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Actualizar la cantidad de un producto en la lista
exports.actualizarCantidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;
        const usuario_id = req.user.id;

        if (!cantidad || cantidad < 1) {
            return res.status(400).json({ message: "La cantidad debe ser mayor a 0." });
        }

        const usuarioProducto = await UsuarioProducto.findOne({
            where: { id, usuario_id },
        });

        if (!usuarioProducto) {
            return res.status(404).json({ message: "Producto no encontrado en la lista." });
        }

        usuarioProducto.cantidad = cantidad;
        await usuarioProducto.save();

        res.json({ message: "Cantidad actualizada.", usuarioProducto });
    } catch (error) {
        console.error("❌ Error al actualizar cantidad:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Eliminar un producto de la lista del usuario
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.user.id;

        const usuarioProducto = await UsuarioProducto.findOne({
            where: { id, usuario_id },
        });

        if (!usuarioProducto) {
            return res.status(404).json({ message: "Producto no encontrado en la lista." });
        }

        await usuarioProducto.destroy();
        res.json({ message: "Producto eliminado de la lista." });
    } catch (error) {
        console.error(" Error al eliminar producto de la lista:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

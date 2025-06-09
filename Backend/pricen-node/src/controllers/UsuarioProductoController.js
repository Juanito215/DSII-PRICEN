const UsuarioProducto = require("../models/UsuarioProducto");
const Producto = require("../models/Producto");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const { QueryTypes } = require("sequelize");

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

// 🔹 Buscar un producto en la lista del usuario por nombre
exports.buscarProductoPorNombre = async (req, res) => {
    try {
        const usuario_id = req.user.id; // ID del usuario autenticado
        const { nombre } = req.query; // Captura el nombre desde la URL

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un nombre de producto." });
        }

        const productos = await UsuarioProducto.findAll({
            where: { usuario_id },
            include: [
                {
                    model: Producto,
                    where: {
                        nombre: { [Op.iLike]: `%${nombre}%` }, // Búsqueda sin importar mayúsculas/minúsculas
                    },
                },
            ],
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos con ese nombre en la lista del usuario." });
        }

        res.json(productos);
    } catch (error) {
        console.error("❌ Error al buscar producto por nombre:", error);
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

// En UsuarioProductoController.js
exports.eliminarProductoPorIds = async (req, res) => {
    try {
        const { productoId } = req.params;
        const usuario_id = req.user.id; // ID del usuario autenticado (del token)

        console.log(`Eliminando producto ${productoId} para usuario ${usuario_id}`);

        const usuarioProducto = await UsuarioProducto.findOne({
            where: { 
                usuario_id, // Usamos directamente el ID del usuario autenticado
                producto_id: productoId 
            },
        });

        if (!usuarioProducto) {
            return res.status(404).json({ 
                message: "Producto no encontrado en tu lista",
                success: false
            });
        }

        await usuarioProducto.destroy();
        
        res.json({ 
            success: true,
            message: "Producto eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ 
            success: false,
            message: "Error en el servidor",
            error: error.message 
        });
    }
};
exports.obtenerProductosPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const productos = await sequelize.query(`
      SELECT 
        p.id,
        p.nombre,
        p.imagen,
        p.categoria,
        p.descripcion,
        p.peso,
        p.unidad_medida,
        p.marca,
        p.visitas_semana,
        pmf.precio,
        s.nombre AS supermercado_nombre
      FROM usuario_productos up
      JOIN productos p ON up.producto_id = p.id
      LEFT JOIN precio_mas_frecuente pmf ON p.id = pmf.producto_id
      LEFT JOIN supermercados s ON pmf.supermercado_id = s.id
      WHERE up.usuario_id = :usuarioId
    `, {
      replacements: { usuarioId },
      type: QueryTypes.SELECT
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos del usuario:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
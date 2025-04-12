const Producto = require("../models/Producto");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const { QueryTypes } = require("sequelize");
// 🔹 Crear producto (Solo Admin)
exports.createProducto = async (req, res) => {
    try {
        // 📌 Verificamos si el usuario tiene rol de "admin"
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden crear productos." });
        }

        const { nombre, categoria, imagen, descripcion, peso, unidad_medida, marca } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: "El nombre es obligatorio." });
        }

        const producto = await Producto.create({
            nombre,
            categoria,
            imagen,
            descripcion,
            peso,
            unidad_medida,
            marca,
        });

        res.status(201).json({ message: "Producto creado exitosamente.", producto });
    } catch (error) {
        console.error("❌ Error al crear producto:", error);
        res.status(500).json({ message: "Error en el servidor.", error: error.message });
    }
};

// 🔹 Obtener todos los productos
exports.getProductos = async (req, res) => {
  try {
      const productos = await Producto.findAll();
      res.json(productos);
  } catch (error) {
      console.error("❌ Error al obtener productos:", error);
      res.status(500).json({ message: "Error en el servidor." });
  }
};


// 🔹 Actualizar producto (Solo Admin)
exports.updateProducto = async (req, res) => {
  try {
      // 📌 Verificamos si el usuario tiene rol de "admin"
      if (!req.user || req.user.rol !== "admin") {
          return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden actualizar productos." });
      }

      const { nombre, categoria, imagen, descripcion, peso, unidad_medida, marca } = req.body;
      const { id } = req.params; // Obtener ID del producto desde la URL

      // 📌 Verificamos si el producto existe
      const producto = await Producto.findByPk(id);
      if (!producto) {
          return res.status(404).json({ message: "Producto no encontrado." });
      }

      // 📌 Actualizamos los campos si se proporcionan nuevos valores
      producto.nombre = nombre || producto.nombre;
      producto.categoria = categoria || producto.categoria;
      producto.imagen = imagen || producto.imagen;
      producto.descripcion = descripcion || producto.descripcion;
      producto.peso = peso || producto.peso;
      producto.unidad_medida = unidad_medida || producto.unidad_medida;
      producto.marca = marca || producto.marca;

      await producto.save(); // Guardar cambios en la BD

      res.json({ message: "Producto actualizado correctamente.", producto });
  } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
      res.status(500).json({ message: "Error en el servidor." });
  }
};

// 🔹 Eliminar producto (Solo Admin)
exports.deleteProducto = async (req, res) => {
  try {
      // 📌 Verificamos si el usuario tiene rol de "admin"
      if (!req.user || req.user.rol !== "admin") {
          return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar productos." });
      }

      const { id } = req.params; // Obtener el ID del producto desde la URL

      // 📌 Verificamos si el producto existe
      const producto = await Producto.findByPk(id);
      if (!producto) {
          return res.status(404).json({ message: "Producto no encontrado." });
      }

      // 📌 Eliminamos el producto
      await producto.destroy();

      res.json({ message: "Producto eliminado correctamente." });
  } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
      res.status(500).json({ message: "Error en el servidor." });
  }
};

// 🔎 Buscar productos por nombre
exports.buscarProductos = async (req, res) => {
    const { query } = req.query;
  
    try {
      if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Debe proporcionar un término de búsqueda." });
      }
  
      const productos = await Producto.findAll({
        where: {
          nombre: {
            [Op.iLike]: `%${query}%`  // 🔍 Búsqueda insensible a mayúsculas y similares
          }
        }
      });
  
      res.json(productos);
    } catch (error) {
      console.error("❌ Error al buscar productos:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  };

  // 🔹 Obtener productos con su precio más frecuente
exports.getProductosConPrecio = async (req, res) => {
    try {
      const [productosConPrecio] = await sequelize.query(`
        SELECT 
          p.id,
          p.nombre,
          p.imagen,
          p.categoria,
          p.descripcion,
          p.peso,
          p.unidad_medida,
          p.marca,
          v.precio
        FROM productos p
        JOIN precio_mas_frecuente v ON p.id = v.producto_id
      `);
  
      res.json(productosConPrecio);
    } catch (error) {
      console.error("❌ Error al obtener productos con precios:", error);
      res.status(500).json({ message: "Error del servidor." });
    }
  };

// 🔹 Obtener productos por categoría

exports.getProductosPorCategoria = async (req, res) => {
  try {
    // Verifica que sequelize sea válido
    if (!sequelize || typeof sequelize.query !== 'function') {
      throw new Error('La instancia de Sequelize no está configurada correctamente');
    }

    const query = `
      SELECT 
        p.id,
        p.nombre,
        p.imagen,
        pmf.precio,
        s.nombre as supermercado_nombre
      FROM productos p
      JOIN precio_mas_frecuente pmf ON p.id = pmf.producto_id
      LEFT JOIN supermercados s ON pmf.supermercado_id = s.id
      WHERE p.categoria = :categoria
    `;

    const productos = await sequelize.query(query, {
      replacements: { categoria: req.params.categoria },
      type: QueryTypes.SELECT // Usa QueryTypes explícitamente
    });

    res.json(productos);
  } catch (error) {
    console.error('Error en getProductosPorCategoria:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,      // Muestra la consulta SQL fallida
      parameters: error.parameters
    });
    
    res.status(500).json({ 
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};
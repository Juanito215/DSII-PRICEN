const Supermercado = require("../models/Supermercado");
const { Op } = require("sequelize"); // Operadores para búsquedas

// 🔹 Registrar un supermercado (Solo Admin)
exports.createSupermercado = async (req, res) => {
    try {
        // 📌 Verificamos si el usuario tiene rol de "admin"
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden registrar supermercados." });
        }

        const { nombre, ubicacion } = req.body;

        // 📌 Validar que los campos sean obligatorios
        if (!nombre || !ubicacion) {
            return res.status(400).json({ message: "Nombre y ubicación son obligatorios." });
        }

        // 📌 Crear el supermercado en la base de datos
        const supermercado = await Supermercado.create({ nombre, ubicacion });

        res.status(201).json({ message: "Supermercado registrado exitosamente.", supermercado });
    } catch (error) {
        console.error("❌ Error al registrar supermercado:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Obtener todos los supermercados o buscar por nombre
exports.getSupermercados = async (req, res) => {
    try {
        const { nombre } = req.query; // 📌 Captura el nombre desde la URL (si existe)

        let whereCondition = {}; // Inicializamos la condición de búsqueda

        if (nombre) {
            whereCondition.nombre = { [Op.iLike]: `%${nombre}%` }; // Búsqueda insensible a mayúsculas/minúsculas
        }

        const supermercados = await Supermercado.findAll({ where: whereCondition });

        if (supermercados.length === 0) {
            return res.status(404).json({ message: "No se encontraron supermercados." });
        }

        res.json(supermercados);
    } catch (error) {
        console.error("❌ Error al obtener supermercados:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Actualizar supermercado (Solo Admin)
exports.updateSupermercado = async (req, res) => {
    try {
        // 📌 Verificamos si el usuario tiene rol de "admin"
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden actualizar supermercados." });
        }

        const { id } = req.params; // 📌 Obtener ID del supermercado desde la URL
        const { nombre, ubicacion } = req.body; // 📌 Datos a actualizar

        // 📌 Verificamos si el supermercado existe
        const supermercado = await Supermercado.findByPk(id);
        if (!supermercado) {
            return res.status(404).json({ message: "Supermercado no encontrado." });
        }

        // 📌 Actualizamos los campos solo si se proporcionan nuevos valores
        supermercado.nombre = nombre || supermercado.nombre;
        supermercado.ubicacion = ubicacion || supermercado.ubicacion;

        await supermercado.save(); // Guardar cambios en la BD

        res.json({ message: "Supermercado actualizado correctamente.", supermercado });
    } catch (error) {
        console.error("❌ Error al actualizar supermercado:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

// 🔹 Eliminar supermercado (Solo Admin)
exports.deleteSupermercado = async (req, res) => {
    try {
        // 📌 Verificamos si el usuario tiene rol de "admin"
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar supermercados." });
        }

        const { id } = req.params; // 📌 Obtener el ID del supermercado desde la URL

        // 📌 Verificamos si el supermercado existe
        const supermercado = await Supermercado.findByPk(id);
        if (!supermercado) {
            return res.status(404).json({ message: "Supermercado no encontrado." });
        }

        // 📌 Eliminamos el supermercado
        await supermercado.destroy();

        res.json({ message: "Supermercado eliminado correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar supermercado:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};
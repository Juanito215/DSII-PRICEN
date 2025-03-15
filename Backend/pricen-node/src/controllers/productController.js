// productController.js - Devuelve productos disponibles para comparación
exports.getProducts = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM productos');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// priceController.js - Recibe precios de usuarios y calcula el más común
exports.addPrice = async (req, res) => {
    try {
        const { producto_id, precio, usuario_id } = req.body;
        await db.query('INSERT INTO precios (producto_id, precio, usuario_id) VALUES ($1, $2, $3)', [producto_id, precio, usuario_id]);
        res.status(201).json({ message: 'Precio agregado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar precio' });
    }
};
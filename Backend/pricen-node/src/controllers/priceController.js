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

exports.getMostCommonPrice = async (req, res) => {
    try {
        const { producto_id } = req.params;
        const result = await db.query('SELECT precio, COUNT(precio) as frecuencia FROM precios WHERE producto_id = $1 GROUP BY precio ORDER BY frecuencia DESC LIMIT 1', [producto_id]);
        res.json({ mostCommonPrice: result.rows[0]?.precio || null });
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular el precio más común' });
    }
};

// userController.js - Maneja el registro, login y perfil de usuario
const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', [nombre, email, hashedPassword]);
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0 || !(await bcrypt.compare(password, result.rows[0].password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
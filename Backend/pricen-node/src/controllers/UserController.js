const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

// Registrar usuario
exports.register = async (req, res) => {
  try {
   
    const { nombre, email, password_hash } = req.body;

    if (!nombre || !email || !password_hash) {
      console.log("⚠ Error: Uno o más campos están vacíos.");
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const user = await Usuario.create({
      nombre,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ message: "Usuario registrado exitosamente", user });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// Obtener todos los usuarios (oculta la contraseña)
exports.getUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: { exclude: ["password_hash"] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

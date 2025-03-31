const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Registrar usuario
exports.register = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log("📩 Datos recibidos en registro:", req.body); 

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

// Login

exports.login = async (req, res) => {


  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      console.log("⚠ Usuario no encontrado en la base de datos.");
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    console.log("✅ Usuario encontrado:", usuario.dataValues);

    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match) {
      console.log("❌ Contraseña incorrecta.");
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET, // 🔹 Guarda una clave secreta en `.env`
      { expiresIn: "1h" }
    );

    res.json({ message: "Inicio de sesión exitoso.", token });
  } catch (error) {
    console.error("❌ Error en login:", error); 
    res.status(500).json({ message: "Error en el servidor.", error: error.message });
  }
};
  
// Obtener perfil de usuario

exports.getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado." });

    res.json(usuario);
  } catch (error) {
    console.error("❌ Error en perfil:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// Actualizar perfil de usuario

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // 📌 Obtener ID desde la URL
    const { nombre, email } = req.body; // 📌 Datos a actualizar

    console.log("🔄 ID a actualizar:", id);
    console.log("📩 Datos recibidos:", req.body);

    const usuario = await Usuario.findByPk(id); // 📌 Buscar usuario por ID
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // ✅ Solo permitir actualizar su propio perfil (o permitir admin)
    if (req.user.id !== usuario.id && req.user.rol !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para actualizar este usuario." });
    }

    // 🔹 Actualizar solo los campos enviados
    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;

    await usuario.save(); // 📌 Guardar cambios en la base de datos

    res.json({ message: "Usuario actualizado correctamente.", usuario });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error en el servidor.", error: error.message });
  }
};
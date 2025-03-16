const sequelize = require("./database").sequelize;
const Usuario = require("../models/Usuario");

(async () => {
  try {
    await sequelize.sync({ alter: true }); // Usa alter para actualizar la estructura sin perder datos
    console.log("✅ Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
})();

// src/models/Recompensa.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Recompensa = sequelize.define("recompensas", {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  puntos_necesarios: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

module.exports = Recompensa;

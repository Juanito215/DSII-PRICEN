// src/models/Canje.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Canje = sequelize.define("canjes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id",
    },
  },
  recompensa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "recompensas",
      key: "id",
    },
  },
  fecha_canje: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false
});

module.exports = Canje;

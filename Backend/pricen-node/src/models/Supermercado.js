const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Supermercado = sequelize.define(
  "supermercados",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "supermercados",
    timestamps: false,
  }
);

module.exports = Supermercado;

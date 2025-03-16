const { DataTypes } = require("sequelize");
const sequelize = require("../config/database").sequelize;

const Usuario = sequelize.define(
  "Usuario",
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
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    puntos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    rol: {
      type: DataTypes.TEXT,
      defaultValue: "usuario",
      validate: {
        isIn: [["usuario", "admin"]],
      },
    },
  },
  {
    tableName: "usuarios", // Asegura que Sequelize use el nombre correcto
    timestamps: false, // Ya tenemos `fecha_registro`, no necesitamos `createdAt` y `updatedAt`
  }
);

module.exports = Usuario;

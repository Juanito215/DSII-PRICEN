const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Usuario = require("./Usuario");

const HistorialPuntos = sequelize.define(
  "historial_puntos",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
      onDelete: "CASCADE", // Si se elimina un usuario, también se eliminan sus registros de puntos
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    puntos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "historial_puntos",
    timestamps: false, // No queremos `createdAt` ni `updatedAt`
  }
);

// Definir relación con el modelo de Usuario
HistorialPuntos.belongsTo(Usuario, { foreignKey: "usuario_id" });

module.exports = HistorialPuntos;

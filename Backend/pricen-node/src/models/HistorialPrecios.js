const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Producto = require("./Producto");
const Supermercado = require("./Supermercado");

const HistorialPrecios = sequelize.define(
  "historial_precios",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Producto,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    supermercado_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Supermercado,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    precio_antiguo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio_actualizado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "historial_precios",
    timestamps: false,
  }
);

// Definir relaciones
HistorialPrecios.belongsTo(Producto, { foreignKey: "producto_id" });
HistorialPrecios.belongsTo(Supermercado, { foreignKey: "supermercado_id" });

module.exports = HistorialPrecios;

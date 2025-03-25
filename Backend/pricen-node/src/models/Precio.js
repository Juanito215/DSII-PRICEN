const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Importamos los modelos relacionados
const Producto = require("./Producto");
const Supermercado = require("./Supermercado");
const Usuario = require("./Usuario");

const Precio = sequelize.define(
  "precios",
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
      onDelete: "CASCADE", // Si se elimina un producto, sus precios también se eliminan
    },
    supermercado_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Supermercado,
        key: "id",
      },
      onDelete: "CASCADE", // Si se elimina un supermercado, sus precios también se eliminan
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: true, // Puede ser NULL si el usuario es anónimo
      references: {
        model: Usuario,
        key: "id",
      },
      onDelete: "SET NULL", // Si se elimina un usuario, los precios quedan sin referencia
    },
    precio: {
      type: DataTypes.NUMERIC(10, 2),
      allowNull: false,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "precios", // Asegura que el nombre de la tabla coincide con PostgreSQL
    timestamps: false, // No queremos `createdAt` y `updatedAt`
  }
);

// Definir relaciones con Sequelize
Precio.belongsTo(Producto, { foreignKey: "producto_id" });
Precio.belongsTo(Supermercado, { foreignKey: "supermercado_id" });
Precio.belongsTo(Usuario, { foreignKey: "usuario_id" });

module.exports = Precio;

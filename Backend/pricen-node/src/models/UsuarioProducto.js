const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Importamos los modelos relacionados
const Usuario = require("./Usuario");
const Producto = require("./Producto");

const UsuarioProducto = sequelize.define(
  "usuario_productos",
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
      onDelete: "CASCADE", // Si un usuario se elimina, también se eliminan sus productos
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Producto,
        key: "id",
      },
      onDelete: "CASCADE", // Si un producto se elimina, también se elimina de la lista de usuarios
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1, // La cantidad mínima debe ser 1
      },
    },
    fecha_agregado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuario_productos", // Asegura que el nombre de la tabla coincide con PostgreSQL
    timestamps: false, // No queremos `createdAt` y `updatedAt`
  }
);

// Definir relaciones con Sequelize
UsuarioProducto.belongsTo(Usuario, { foreignKey: "usuario_id" });
UsuarioProducto.belongsTo(Producto, { foreignKey: "producto_id" });

module.exports = UsuarioProducto;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Producto = require("./Producto");
const Supermercado = require("./Supermercado");
const Usuario = require("./Usuario");

const ReportePrecio = sequelize.define(
  "reportes_precios",
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
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    precio_reportado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha_reporte: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "reportes_precios",
    timestamps: false,
  }
);

// Relaciones
ReportePrecio.belongsTo(Producto, { foreignKey: "producto_id" });
ReportePrecio.belongsTo(Supermercado, { foreignKey: "supermercado_id" });
ReportePrecio.belongsTo(Usuario, { foreignKey: "usuario_id" });

module.exports = ReportePrecio;

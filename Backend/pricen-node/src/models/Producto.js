const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Producto = sequelize.define("productos", { // 👈 Asegúrate de que el nombre es "productos" (minúsculas)
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.TEXT,
    },
    imagen: {
        type: DataTypes.TEXT,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    peso: {
        type: DataTypes.NUMERIC(10, 2),
    },
    unidad_medida: {
        type: DataTypes.TEXT,
    },
    marca: {
        type: DataTypes.TEXT,
    },
    visitas_semana: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    ultimo_reset: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: "productos", // 👈 PostgreSQL es case-sensitive, debe coincidir con la BD
    timestamps: false,
});

module.exports = Producto;

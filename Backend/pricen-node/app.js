var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./src/routes/index");
var usersRouter = require("./src/routes/userRoutes");

var app = express();

const { sequelize, testConnection } = require("./src/config/database");

// Probar conexión a la base de datos
testConnection()
  .then(() => console.log("✅ Conexión a la base de datos establecida correctamente."))
  .catch((err) => console.error("❌ Error en la conexión a la base de datos:", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 📌 Aquí van las rutas antes del manejo de errores
app.use("/", indexRouter);
app.use("/userRoutes", usersRouter);

// 🚀 RUTA PARA USUARIOS 
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/usuarios", userRoutes);

// 🚀 RUTA PARA PRODUCTOS 
const productRoutes = require("./src/routes/productRoutes");
app.use("/api/productos", productRoutes);

// 🚀 RUTA PARA SUPERMERCADOS 
const supermercadoRoutes = require("./src/routes/supermercadoRoutes");
app.use("/api/supermercados", supermercadoRoutes);

// 🚀 RUTA PARA PRECIOS 
const priceRoutes = require("./src/routes/precioRoutes");
app.use("/api/precios", priceRoutes);

// 🚀 RUTA PARA LISTA DE PRODUCTOS DE USUARIO
const usuarioProductoRoutes = require("./src/routes/usuarioProductoRoutes");
app.use("/api/usuario-producto", usuarioProductoRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

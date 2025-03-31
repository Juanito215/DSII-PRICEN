const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { sequelize, testConnection } = require("./src/config/database");
const cron = require("node-cron");
const { actualizarPrecios } = require("./src/jobs/actualizarPrecios");
const cors = require("cors");
const port = process.env.PORT || 3000;

// Cargar variables de entorno
dotenv.config();

const app = express();
const app = require("./app");
app.use(cors());
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173", // URL del frontend (ajústala si es otra)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares
app.use(express.json()); // Para manejar JSON
app.use(express.urlencoded({ extended: true })); // Para manejar formularios
app.use(cors()); // Permitir CORS
app.use(helmet()); // Seguridad básica
app.use(morgan("dev")); // Logs HTTP

// Rutas
const userRoutes = require("./src/routes/users");
const priceRoutes = require("./src/routes/index");
app.use("/api/users", userRoutes);
app.use("/api/prices", priceRoutes);


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.sync(); // Sincronizar modelos con la BD
    console.log(`🚀 Servidor corriendo en http://localhost:${3000}`);
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
});

app.listen(port, () => {
  console.log("Servidor corriendo en http://localhost:3000");
}
);

// Tarea programada para actualizar precios
cron.schedule("0 0 * * 0", async () => {
  console.log(" Actualización semanal de precios...");
  await actualizarPrecios();
});

// Sincronizar la base de datos
require("./src/config/syncDB");



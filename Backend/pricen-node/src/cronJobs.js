// cronJobs.js
const cron = require("node-cron");
const { Producto } = require("./models");

// Reset semanal (domingo a las 00:00)
cron.schedule("0 0 * * 0", async () => {
    try {
        await Producto.update(
            { visitas_semana: 0, ultimo_reset: new Date() },
            { where: {} }  // Actualiza todos los productos
        );
        console.log("♻️ Contadores de visitas reseteados");
    } catch (error) {
        console.error("Error en reset semanal:", error);
    }
});

module.exports = cron;
const express = require("express");
const router = express.Router();
const productoController = require("../controllers/ProductoController");
const { verifyToken } = require("../middlewares/authMiddleware"); // Protegemos rutas
const upload = require("../middlewares/upload"); // Middleware para subir imágenes

// 🔹 Rutas para productos
router.post("/registerProduct", verifyToken, upload.single('imagen'), productoController.createProducto);
router.get("/getProduct", productoController.getProductos);
router.get("/buscar", productoController.buscarProductos);
router.get("/con-precio", productoController.getProductosConPrecio);
router.get("/economicos/:categoria", productoController.getProductoMasEconomicoPorCategoria);
router.put("/:id", verifyToken, productoController.updateProducto);
router.get("/categoria/:categoria", productoController.getProductosPorCategoria);
router.delete("/:id", verifyToken, productoController.deleteProducto);
router.post("/:id/incrementar-visitas", productoController.incrementarVisitas);
router.get('/mas-vistos', productoController.getProductosMasVistos);
router.get('/filtrar', productoController.filtrarProductos);
router.get("/:id", productoController.getProductoById);
module.exports = router;
    
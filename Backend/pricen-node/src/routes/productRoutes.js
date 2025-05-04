const express = require("express");
const router = express.Router();
const productoController = require("../controllers/ProductoController");
const { verifyToken } = require("../middlewares/authMiddleware"); // Protegemos rutas

// 🔹 Rutas para productos
router.post("/registerProduct", verifyToken, productoController.createProducto);
router.get("/getProduct", productoController.getProductos);
router.get("/buscar", productoController.buscarProductos);
router.get("/con-precio", productoController.getProductosConPrecio);
router.get("/economicos/:categoria", productoController.getProductoMasEconomicoPorCategoria);
router.put("/:id", verifyToken, productoController.updateProducto);
router.get("/categoria/:categoria", productoController.getProductosPorCategoria);
router.delete("/:id", verifyToken, productoController.deleteProducto);
module.exports = router;

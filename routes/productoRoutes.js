const express = require('express');
const router = express.Router();
const { getProductos } = require('../controllers/productoController');

// Ruta: GET /api/productos
router.get('/', getProductos);

module.exports = router;
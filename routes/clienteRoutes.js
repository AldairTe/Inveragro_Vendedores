const express = require('express');
const router = express.Router();
const { getClientes, createCliente } = require('../controllers/clienteController');

// Ruta: GET /api/clientes
router.get('/', getClientes);

// Ruta: POST /api/clientes
router.post('/', createCliente);

module.exports = router;
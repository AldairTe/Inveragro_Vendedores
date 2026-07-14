const express = require('express');
const router = express.Router();
const { getClientes, createCliente, actualizarCliente, eliminarCliente } = require('../controllers/clienteController');

router.get('/', getClientes);
router.post('/', createCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;
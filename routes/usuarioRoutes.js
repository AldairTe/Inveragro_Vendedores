const express = require('express');
const router = express.Router();
const { loginUsuario, getVendedores ,crearVendedor,actualizarVendedor, eliminarVendedor} = require('../controllers/usuarioController');

// Ruta: POST /api/usuarios/login
router.post('/login', loginUsuario);
router.get('/vendedores', getVendedores);
router.post('/', crearVendedor);
router.put('/:id', actualizarVendedor);
router.delete('/:id', eliminarVendedor);

module.exports = router;
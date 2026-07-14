const express = require('express');
const router = express.Router();
const { loginUsuario, getVendedores ,crearVendedor} = require('../controllers/usuarioController');

// Ruta: POST /api/usuarios/login
router.post('/login', loginUsuario);
router.get('/vendedores', getVendedores);
router.post('/', crearVendedor);

module.exports = router;
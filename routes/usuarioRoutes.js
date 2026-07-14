const express = require('express');
const router = express.Router();
const { loginUsuario, getVendedores } = require('../controllers/usuarioController');

// Ruta: POST /api/usuarios/login
router.post('/login', loginUsuario);
router.get('/vendedores', getVendedores);

module.exports = router;
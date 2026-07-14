const express = require('express');
const router = express.Router();
const { loginUsuario } = require('../controllers/usuarioController');

// Ruta: POST /api/usuarios/login
router.post('/login', loginUsuario);

module.exports = router;
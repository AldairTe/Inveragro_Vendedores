const express = require('express');
const router = express.Router();
const { sincronizarDatos } = require('../controllers/sincronizacionController');

// Ruta: POST /api/sincronizar
router.post('/', sincronizarDatos);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getEstadoLicencia } = require('../controllers/licenciaController');

// Ruta: GET /api/licencia/estado
router.get('/estado', getEstadoLicencia);

module.exports = router;
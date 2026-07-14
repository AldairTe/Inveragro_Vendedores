const db = require('../config/db');

// Obtener el estado actual de la licencia de la app
const getEstadoLicencia = async (req, res) => {
    try {
        // Consultamos la licencia (Asumiendo ID 1 para el cliente de prueba)
        const query = 'SELECT activa, fecha_vencimiento FROM licencia_app WHERE id = 1';
        const { rows } = await db.query(query);

        // Si por alguna razón borraron el registro en la BD
        if (rows.length === 0) {
            return res.status(404).json({ 
                activa: false, 
                mensaje: 'Licencia no encontrada en el sistema.' 
            });
        }

        const licencia = rows[0];
        const fechaActual = new Date();
        const fechaVencimiento = new Date(licencia.fecha_vencimiento);

        // Candado 1: ¿La apagaste manualmente?
        // Candado 2: ¿Ya pasó la fecha de vencimiento?
        if (!licencia.activa || fechaActual > fechaVencimiento) {
            return res.json({ 
                activa: false, 
                mensaje: 'El periodo de prueba o la licencia de uso ha caducado. Contacte a soporte.' 
            });
        }

        // Si pasa los candados, damos luz verde
        res.json({ 
            activa: true, 
            mensaje: 'Licencia válida.' 
        });

    } catch (error) {
        console.error('Error al verificar licencia:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar la licencia' });
    }
};

module.exports = {
    getEstadoLicencia
};
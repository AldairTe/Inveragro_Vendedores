const db = require('../config/db');

const getEstadoLicencia = async (req, res) => {
    try {
        const query = 'SELECT activa, fecha_vencimiento FROM licencia_app WHERE id = 1';
        const { rows } = await db.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ activa: false, mensaje: 'Licencia no encontrada', dias_restantes: 0 });
        }

        const licencia = rows[0];
        const fechaActual = new Date();
        const fechaVencimiento = new Date(licencia.fecha_vencimiento);

        // --- CÁLCULO DE DÍAS RESTANTES ---
        const milisegundosPorDia = 1000 * 60 * 60 * 24;
        const diferenciaMilisegundos = fechaVencimiento.getTime() - fechaActual.getTime();
        // Usamos Math.ceil para redondear hacia arriba (ej. si faltan 1.2 días, mostrará 2)
        const diasRestantes = Math.ceil(diferenciaMilisegundos / milisegundosPorDia);

        if (!licencia.activa || fechaActual > fechaVencimiento) {
            return res.json({ 
                activa: false, 
                mensaje: 'El periodo de prueba ha caducado.',
                dias_restantes: 0 
            });
        }

        res.json({ 
            activa: true, 
            mensaje: 'Licencia válida.',
            dias_restantes: diasRestantes // Enviamos el dato al celular
        });

    } catch (error) {
        console.error('Error al verificar licencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getEstadoLicencia };
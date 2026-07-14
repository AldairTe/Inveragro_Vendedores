const db = require('../config/db');

const loginUsuario = async (req, res) => {
    const { dni, password } = req.body;
    
    try {
        // En una versión más avanzada usaremos bcrypt para comparar hashes, 
        // pero por ahora lo comparamos directamente con lo que hay en la BD.
        const query = 'SELECT id, nombre_completo, estado FROM usuarios WHERE dni = $1 AND password_hash = $2';
        const { rows } = await db.query(query, [dni, password]);
        
        if (rows.length > 0) {
            // Si el estado es falso (inactivo), le bloqueamos el acceso
            if (!rows[0].estado) {
                return res.status(403).json({ error: 'Usuario inactivo' });
            }
            res.json(rows[0]); // Devolvemos los datos del usuario al celular
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { loginUsuario };
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

// NUEVA FUNCIÓN: Obtener la lista de todos los vendedores con su conteo de clientes
const getVendedores = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.dni, 
                u.nombre_completo, 
                u.estado,
                COUNT(c.id)::INTEGER AS clientes_asignados
            FROM usuarios u
            LEFT JOIN clientes c ON u.id = c.vendedor_id
            GROUP BY u.id
            ORDER BY u.nombre_completo ASC
        `;
        const { rows } = await db.query(query);
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener vendedores:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// NUEVA FUNCIÓN: Crear un nuevo vendedor (usuario)
const crearVendedor = async (req, res) => {
    const { dni, nombre_completo, password_hash } = req.body;

    // Validación básica
    if (!dni || !nombre_completo || !password_hash) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const query = `
            INSERT INTO usuarios (dni, nombre_completo, password_hash) 
            VALUES ($1, $2, $3) 
            RETURNING id, dni, nombre_completo, estado
        `;
        const { rows } = await db.query(query, [dni, nombre_completo, password_hash]);
        
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear vendedor:', error);
        // 23505 es el código de error en PostgreSQL para "Unique violation" (DNI duplicado)
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Este DNI ya está registrado en el sistema' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualiza tus exportaciones al final del archivo
module.exports = { loginUsuario, getVendedores, crearVendedor };

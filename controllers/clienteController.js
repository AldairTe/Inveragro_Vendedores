const db = require('../config/db');

// 1. Obtener clientes (Inteligente: Móvil filtra, Admin ve todos)
const getClientes = async (req, res) => {
    const { vendedor_id } = req.query; 

    try {
        if (vendedor_id) {
            // Lógica App Móvil: Solo los clientes de este vendedor
            const { rows } = await db.query('SELECT * FROM clientes WHERE vendedor_id = $1', [vendedor_id]);
            return res.json(rows);
        } else {
            // Lógica Panel Admin: Traer TODOS los clientes y unir el nombre del vendedor
            const query = `
                SELECT c.*, u.nombre_completo as vendedor_nombre 
                FROM clientes c 
                LEFT JOIN usuarios u ON c.vendedor_id = u.id
                ORDER BY c.nombre_fundo ASC
            `;
            const { rows } = await db.query(query);
            return res.json(rows);
        }
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 2. Crear un nuevo cliente (Ahora exige saber a qué vendedor pertenece)
const createCliente = async (req, res) => {
    // Añadimos vendedor_id a los datos que esperamos recibir
    const { nombre_fundo, nombre_contacto, telefono, latitud, longitud, vendedor_id } = req.body;
    
    try {
        const query = `
            INSERT INTO clientes (nombre_fundo, nombre_contacto, telefono, latitud, longitud, vendedor_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *;
        `;
        const values = [nombre_fundo, nombre_contacto, telefono, latitud, longitud, vendedor_id];
        
        const { rows } = await db.query(query, values);
        res.status(201).json(rows[0]); // Devolvemos el cliente recién creado
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error al guardar el cliente' });
    }
};

// Actualizar Cliente
const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre_fundo, nombre_contacto, telefono, latitud, longitud, vendedor_id, estado } = req.body;

    try {
        const query = `
            UPDATE clientes 
            SET nombre_fundo = $1, nombre_contacto = $2, telefono = $3, 
                latitud = $4, longitud = $5, vendedor_id = $6, estado = $7
            WHERE id = $8 
            RETURNING *;
        `;
        const values = [nombre_fundo, nombre_contacto, telefono, latitud, longitud, vendedor_id, estado, id];
        const { rows } = await db.query(query, values);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Fundo no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar Cliente (Borrado lógico)
const eliminarCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'UPDATE clientes SET estado = false WHERE id = $1 RETURNING id, nombre_fundo';
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Fundo no encontrado' });
        res.json({ message: 'Fundo desactivado correctamente', cliente: rows[0] });
    } catch (error) {
        console.error('Error al desactivar cliente:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { getClientes, createCliente, actualizarCliente, eliminarCliente };

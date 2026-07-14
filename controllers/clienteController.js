const db = require('../config/db');

// 1. Obtener todos los clientes (Filtrado por vendedor para seguridad)
const getClientes = async (req, res) => {
    // Atrapamos el vendedor_id que Retrofit manda en la URL
    const { vendedor_id } = req.query; 

    // Candado: Si alguien intenta pedir clientes sin identificarse, lo bloqueamos
    if (!vendedor_id) {
        return res.status(400).json({ error: 'Falta el parámetro vendedor_id en la petición' });
    }

    try {
        // Usamos $1 para evitar inyecciones SQL y filtramos por el vendedor exacto
        const { rows } = await db.query('SELECT * FROM clientes WHERE vendedor_id = $1', [vendedor_id]);
        res.json(rows);
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

module.exports = {
    getClientes,
    createCliente
};
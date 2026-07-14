const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Comprobar la conexión
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error adquiriendo cliente de la base de datos', err.stack);
    }
    console.log('Conectado exitosamente a PostgreSQL (agro_ventas_db)');
    release();
});

module.exports = pool;
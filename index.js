const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json()); 

// --- AQUÍ IMPORTAMOS NUESTRAS RUTAS ---
const clienteRoutes = require('./routes/clienteRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const sincronizacionRoutes = require('./routes/sincronizacionRoutes');
const licenciaRoutes = require('./routes/licencia');

// --- AQUÍ LAS USAMOS ---
app.use('/api/clientes', clienteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/sincronizar', sincronizacionRoutes);
app.use('/api/licencia', licenciaRoutes);

app.get('/', (req, res) => {
    res.send('¡Backend Agro Ventas funcionando al 100%!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
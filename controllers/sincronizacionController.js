const db = require('../config/db');

const sincronizarDatos = async (req, res) => {
    // La app enviará un JSON con arrays de asistencias y visitas
    const { asistencias, visitas } = req.body;
    
    // Solicitamos un cliente dedicado del pool para hacer la transacción
    const client = await db.connect();

    try {
        await client.query('BEGIN'); // Iniciamos la transacción

        // 1. Guardar Asistencias
        if (asistencias && asistencias.length > 0) {
            for (const asis of asistencias) {
                // Usamos ON CONFLICT por si la app envía dos veces el mismo registro por error de red
                await client.query(
                    `INSERT INTO asistencias (id, usuario_id, fecha_hora, lat_registro, lon_registro, sincronizado) 
                     VALUES ($1, $2, TO_TIMESTAMP($3 / 1000.0), $4, $5, true)
                     ON CONFLICT (id) DO NOTHING`,
                    [asis.id, asis.usuario_id, asis.fecha_hora, asis.lat_registro, asis.lon_registro]
                );
            }
        }

        // 2. Guardar Visitas y sus Productos
        if (visitas && visitas.length > 0) {
            for (const vis of visitas) {
                await client.query(
                    `INSERT INTO visitas (id, usuario_id, cliente_id, fecha_hora, lat_registro, lon_registro, notas, sincronizado) 
                     VALUES ($1, $2, $3, TO_TIMESTAMP($4 / 1000.0), $5, $6, $7, true)
                     ON CONFLICT (id) DO NOTHING`,
                    [vis.id, vis.usuario_id, vis.cliente_id, vis.fecha_hora, vis.lat_registro, vis.lon_registro, vis.notas]
                );

                // 3. Guardar los Detalles (Productos pedidos en esa visita)
                if (vis.detalles && vis.detalles.length > 0) {
                    for (const det of vis.detalles) {
                        await client.query(
                            `INSERT INTO visita_detalles (visita_id, producto_id, cantidad, precio_acordado) 
                             VALUES ($1, $2, $3, $4)`,
                            [vis.id, det.producto_id, det.cantidad, det.precio_acordado]
                        );
                    }
                }
            }
        }

        await client.query('COMMIT'); // Si todo salió bien, guardamos los cambios
        res.json({ mensaje: 'Sincronización completada con éxito' });

    } catch (error) {
        await client.query('ROLLBACK'); // Si algo falla, deshacemos todo
        console.error('Error en sincronización:', error);
        res.status(500).json({ error: 'Fallo al sincronizar los datos' });
    } finally {
        client.release(); // Liberamos el cliente devuelta al pool
    }
};

module.exports = { sincronizarDatos };
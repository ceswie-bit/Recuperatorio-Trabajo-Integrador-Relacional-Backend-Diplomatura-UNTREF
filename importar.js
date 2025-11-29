const fs = require('fs');
const path = require('path');
const db = require('./conexion/database');

// Leemos el archivo JSON
const rutaArchivo = path.join(__dirname, 'json', 'trailerflix.json');
const datosRaw = fs.readFileSync(rutaArchivo, 'utf8');
const catalogo = JSON.parse(datosRaw);

// Función auxiliar para usar promesas con la base de datos (evita el "Callback Hell")
const dbQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

async function importarDatos() {
    try {
        console.log('🔄 Iniciando importación masiva...');

        // 1. Limpiamos la base de datos para empezar de cero (opcional, pero recomendado)
        console.log('🧹 Limpiando tablas anteriores...');
        await dbQuery('SET FOREIGN_KEY_CHECKS = 0');
        await dbQuery('TRUNCATE TABLE contenido_actores');
        await dbQuery('TRUNCATE TABLE contenido_generos');
        await dbQuery('TRUNCATE TABLE contenido');
        await dbQuery('TRUNCATE TABLE actor');
        await dbQuery('TRUNCATE TABLE genero');
        await dbQuery('TRUNCATE TABLE categoria');
        await dbQuery('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Insertamos Categorías Base
        console.log('📂 Insertando categorías...');
        await dbQuery("INSERT INTO categoria (id, nombre) VALUES (1, 'Serie'), (2, 'Película')");

        // 3. Recorremos el JSON e insertamos todo
        for (const item of catalogo) {
            
            // A. Determinar ID de categoría
            const catId = item.categoria === 'Serie' ? 1 : 2;

            // B. Insertar Contenido (Respetamos el ID del JSON)
            // Nota: Convertimos Arrays a String para 'busqueda' si fuera necesario, o lo ignoramos si no está en la tabla
            // normalizar temporadas y duración
            const temporadasVal = (item.temporadas && /^[0-9]+$/.test(String(item.temporadas)))
              ? parseInt(item.temporadas, 10)
              : null;

            const duracionVal = (() => {
              if (!item.duracion) return null;
              const m = String(item.duracion).match(/\d+/);
              return m ? parseInt(m[0], 10) : null;
            })();

            if (item.temporadas && temporadasVal === null) console.warn(`WARN: item ${item.id} temporadas -> ${item.temporadas} (guardando NULL)`);
            if (item.duracion && duracionVal === null) console.warn(`WARN: item ${item.id} duracion -> ${item.duracion} (guardando NULL)`);

            await dbQuery('INSERT INTO contenido SET ?', {
              id: item.id,
              titulo: item.titulo,
              poster: item.poster,
              resumen: item.resumen,
              temporadas: temporadasVal,
              duracion: duracionVal,
              trailer: item.trailer,
              categoria_id: catId
            });

            // C. Procesar Géneros
            if (item.genero && Array.isArray(item.genero)) {
                for (const nombreGenero of item.genero) {
                    // Insertamos género si no existe (INSERT IGNORE)
                    // Primero verificamos si existe para obtener su ID
                    let generoId;
                    const generoExistente = await dbQuery('SELECT id FROM genero WHERE nombre = ?', [nombreGenero]);
                    
                    if (generoExistente.length > 0) {
                        generoId = generoExistente[0].id;
                    } else {
                        const nuevoGenero = await dbQuery('INSERT INTO genero (nombre) VALUES (?)', [nombreGenero]);
                        generoId = nuevoGenero.insertId;
                    }

                    // Relacionamos Contenido - Género
                    await dbQuery('INSERT INTO contenido_generos (contenido_id, genero_id) VALUES (?, ?)', [item.id, generoId]);
                }
            }

            // D. Procesar Actores (Reparto)
            if (item.reparto && Array.isArray(item.reparto)) {
                for (const nombreActor of item.reparto) {
                    // Verificar/Insertar Actor
                    let actorId;
                    const actorExistente = await dbQuery('SELECT id FROM actor WHERE nombre = ?', [nombreActor]);

                    if (actorExistente.length > 0) {
                        actorId = actorExistente[0].id;
                    } else {
                        const nuevoActor = await dbQuery('INSERT INTO actor (nombre) VALUES (?)', [nombreActor]);
                        actorId = nuevoActor.insertId;
                    }

                    // Relacionamos Contenido - Actor
                    await dbQuery('INSERT INTO contenido_actores (contenido_id, actor_id) VALUES (?, ?)', [item.id, actorId]);
                }
            }
            
            process.stdout.write(`.`); // Muestra un puntito por cada película procesada
        }

        console.log('\n\n✅ ¡IMPORTACIÓN COMPLETADA CON ÉXITO!');
        console.log(`✨ Se procesaron ${catalogo.length} elementos.`);
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error fatal durante la importación:', error);
        process.exit(1);
    }
}

importarDatos();
const db = require('../conexion/database'); // 1. Traemos la conexión a la base de datos

const Contenido = {
    // Función listar con Filtros
    listar: (filtros, callback) => {
        // Base de la consulta: Unimos contenido con categorías y géneros
        // Usamos 'DISTINCT' porque los géneros pueden duplicar filas
        let sql = `
            SELECT DISTINCT c.*, cat.nombre AS nombre_categoria 
            FROM contenido c
            LEFT JOIN categoria cat ON c.categoria_id = cat.id
            LEFT JOIN contenido_generos cg ON c.id = cg.contenido_id
            LEFT JOIN genero g ON cg.genero_id = g.id
            WHERE 1=1
        `;
        
        const params = [];

        // 1. Filtro por Título (Búsqueda parcial)
        if (filtros.titulo) {
            sql += ' AND c.titulo LIKE ?';
            params.push(`%${filtros.titulo}%`);
        }

        // 2. Filtro por Categoría (Ej: "Serie" o "Película")
        if (filtros.categoria) {
            sql += ' AND cat.nombre = ?';
            params.push(filtros.categoria);
        }

        // 3. Filtro por Género (Ej: "Ciencia Ficción")
        if (filtros.genero) {
            sql += ' AND g.nombre LIKE ?';     // <--- Cambio aquí
            params.push(`%${filtros.genero}%`); // <--- Agregamos los porcentajes %
        }

        // Ejecutamos la consulta construida
        db.query(sql, params, (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    },

    //Funcion : Buscar por ID
    getById: (id, callback) => {
        const sql = 'SELECT * FROM contenido WHERE id = ?';
        
        
        db.query(sql, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            // Devolvemos results[0] para obtener solo el objeto y no un array
            return callback(null, results[0]); 
        });
    },

    // FUNCIÓN: Crear contenido
    create: (datos, callback) => {
        // La consulta SQL para insertar
        // "SET ?" es un truco de la librería mysql2: mapea automáticamente el objeto a las columnas
        const sql = 'INSERT INTO contenido SET ?'; 
        
        db.query(sql, datos, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            // Devolvemos el ID del nuevo registro creado
            return callback(null, { id: result.insertId, ...datos });
        });
    },

   
    // FUNCIÓN: Actualizar contenido
    update: (id, nuevosDatos, callback) => {
        const sql = 'UPDATE contenido SET ? WHERE id = ?';
        
        db.query(sql, [nuevosDatos, id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    
    // FUNCIÓN: Eliminar contenido (DELETE)
    delete: (id, callback) => {
        const sql = 'DELETE FROM contenido WHERE id = ?';
        
        db.query(sql, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    }

       
};

module.exports = Contenido; // Exportamos el modelo para usarlo en otros lados    
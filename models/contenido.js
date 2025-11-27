const db = require('../conexion/database'); // 1. Traemos la conexión a la base de datos

const Contenido = {
    // Función: Listar todos los contenidos
    listar: (callback) => {
        const sql = 'SELECT * FROM contenido'; // La orden SQL
        
       
        db.query(sql, (err, results) => {
            if (err) {
                // Si algo sale mal, avisamos del error
                return callback(err, null);
            }
            // Si todo sale bien, devolvemos los resultados (las películas)
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
    }
};

module.exports = Contenido; // Exportamos el modelo para usarlo en otros lados    
const db = require('../conexion/database');

const Genero = {
    listar: (callback) => {
        const sql = 'SELECT * FROM genero';
        db.query(sql, (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }
};

module.exports = Genero;
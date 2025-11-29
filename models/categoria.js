const db = require('../conexion/database');

const Categoria = {
    listar: (callback) => {
        const sql = 'SELECT * FROM categoria';
        db.query(sql, (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }
};

module.exports = Categoria;    
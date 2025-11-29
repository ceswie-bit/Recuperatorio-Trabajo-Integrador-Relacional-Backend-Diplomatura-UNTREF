const db = require('../conexion/database');

const Actor = {
    listar: (callback) => {
        const sql = 'SELECT * FROM actor';
        db.query(sql, (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }
};

module.exports = Actor;    
const ContenidoModel = require('../models/contenido'); // Importamos al "Cocinero"

const controller = {
    // Definimos la función que atenderá el pedido "/contenido"
    list: (req, res) => {
        // El controlador le pide al modelo que busque los datos
        ContenidoModel.listar((err, result) => {
            if (err) {
                // Si hay error, enviamos un mensaje de falla (Código 500)
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Si todo sale bien, enviamos los datos en formato JSON (Código 200)
            res.status(200).json(result);
        });

    }, 

    // FUNCIÓN: Buscar por ID
    getById: (req, res) => {
        // 1. Obtenemos el ID que viene en la URL (ej: /contenido/3)
        const id = req.params.id;

        // 2. Llamamos al modelo
        ContenidoModel.getById(id, (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // 3. ¡VALIDACIÓN ! ¿Encontró algo?
            if (!result) {
                // Si el resultado es null o vacío, devolvemos error 404
                res.status(404).json({ message: 'Contenido no encontrado' });
                return;
            }

            // 4. Si existe, lo enviamos
            res.status(200).json(result);
        });
    }
};

module.exports = controller;
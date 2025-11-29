const ContenidoModel = require('../models/contenido');
const CategoriaModel = require('../models/categoria'); 
const GeneroModel    = require('../models/genero'); 
const ActorModel     = require('../models/actor');

// --- HELPER: MANEJO DE ERRORES CENTRALIZADO ---
// Esta función se encarga de responder siempre igual cuando falla la base de datos
const handleError = (res, err) => {
    return res.status(500).json({ error: err.message });
};

const controller = {
    
    // 1. Listar (con o sin filtros)
    list: (req, res) => {
        const filtros = req.query;
        ContenidoModel.listar(filtros, (err, result) => {
            if (err) return handleError(res, err); // <--- ¡Mucho más limpio!

            if (result.length === 0) {
                return res.status(404).json({ message: 'No se encontraron coincidencias' });
            }
            res.status(200).json(result);
        });
    },

    // 2. Buscar por ID
    getById: (req, res) => {
        const id = req.params.id;
        ContenidoModel.getById(id, (err, result) => {
            if (err) return handleError(res, err);

            if (!result) {
                return res.status(404).json({ message: 'Contenido no encontrado' });
            }
            res.status(200).json(result);
        });
    },

    // 3. Crear contenido (POST)
    create: (req, res) => {
        const nuevosDatos = req.body;

        // Validación de datos requeridos (Error 400 es responsabilidad del cliente, no del server)
        if (!nuevosDatos.titulo) {
            return res.status(400).json({ message: 'El título es obligatorio' });
        }

        const { generos, actores, ...contenidoData } = req.body;

        ContenidoModel.create(contenidoData, (err, result) => {
            if (err) return handleError(res, err);
            
            res.status(201).json(result);
        });
    },

    // 4. Actualizar contenido (PUT y PATCH)
    update: (req, res) => {
        const id = req.params.id;
        const { generos, actores, ...contenidoData } = req.body;

        ContenidoModel.update(id, contenidoData, (err, result) => {
            if (err) return handleError(res, err);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Contenido no encontrado para actualizar' });
            }
            res.status(200).json({ message: 'Contenido actualizado exitosamente' });
        });
    },
    
    // 5. Eliminar contenido (DELETE)
    delete: (req, res) => {
        const id = req.params.id;
        ContenidoModel.delete(id, (err, result) => {
            if (err) return handleError(res, err);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Contenido no encontrado para eliminar' });
            }
            res.status(200).json({ message: 'Contenido eliminado exitosamente' });
        });
    },

    // --- ENDPOINTS AUXILIARES ---
    listCategorias: (req, res) => {
        CategoriaModel.listar((err, result) => {
            if (err) return handleError(res, err);
            res.status(200).json(result);
        });
    },
    listGeneros: (req, res) => {
        GeneroModel.listar((err, result) => {
            if (err) return handleError(res, err);
            res.status(200).json(result);
        });
    },
    listActores: (req, res) => {
        ActorModel.listar((err, result) => {
            if (err) return handleError(res, err);
            res.status(200).json(result);
        });
    }
};

module.exports = controller;
const ContenidoModel = require('../models/contenido');
const CategoriaModel = require('../models/categoria'); 
const GeneroModel    = require('../models/genero'); 
const ActorModel     = require('../models/actor');

const controller = {
    // Función para traer contenidos (con o sin filtros)
    list: (req, res) => {
        // Recogemos los filtros de la URL (ej: ?titulo=Matrix)
        const filtros = req.query;

        // Se los pasamos al modelo
        ContenidoModel.listar(filtros, (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            // Si no hay resultados con esos filtros
            if (result.length === 0) {
                return res.status(404).json({ message: 'No se encontraron coincidencias' });
            }
            
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
    },

// FUNCIÓN: Crear contenido (POST)
    create: (req, res) => {
    const nuevosDatos = req.body;

    // VALIDACIÓN PUNTO 15: Si no hay título, error 400
    if (!nuevosDatos.titulo) {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }
        // 1. Separamos los datos
        // Sacamos 'generos' y 'actores' del paquete, y dejamos el resto en 'contenidoData'
        const { generos, actores, ...contenidoData } = req.body;

        // 2. Llamamos al modelo solo con los datos limpios (titulo, poster, etc.)
        ContenidoModel.create(contenidoData, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            // 3. Devolvemos éxito (Aunque por ahora no guardamos generos/actores, 
            // al menos creamos la película sin que explote el servidor)
            res.status(201).json(result);
        });
    },

   
    // NUEVA FUNCIÓN: Actualizar contenido (PUT)
    update: (req, res) => {
        const id = req.params.id;
        // Limpiamos los datos igual que en el create
        const { generos, actores, ...contenidoData } = req.body;

        ContenidoModel.update(id, contenidoData, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Validamos si realmente se actualizó algo
            // 'affectedRows' es un dato que nos da MySQL
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Contenido no encontrado para actualizar' });
            }

            // Si todo salió bien
            res.status(200).json({ message: 'Contenido actualizado exitosamente' });
        });
    },
    
    // FUNCIÓN: Eliminar contenido (DELETE)
    delete: (req, res) => {
        const id = req.params.id;

        ContenidoModel.delete(id, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Validamos si realmente se borró algo
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Contenido no encontrado para eliminar' });
            }

            // Éxito: Se borró correctamente
            // A veces se usa status 204 (No Content) pero usaremos 200 para ver el mensaje
            res.status(200).json({ message: 'Contenido eliminado exitosamente' });
        });
    },

  
      // Endpoints Auxiliares
    listCategorias: (req, res) => {
        CategoriaModel.listar((err, result) => { // Usamos CategoriaModel
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    },
    listGeneros: (req, res) => {
        GeneroModel.listar((err, result) => { // Usamos GeneroModel
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    },
    listActores: (req, res) => {
        ActorModel.listar((err, result) => { // Usamos ActorModel
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });
    }

};

module.exports = controller;
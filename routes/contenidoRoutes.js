const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenidoController'); // Importamos al Controlador

// Listar Todos los contenidos
router.get('/', contenidoController.list);

// 2. Obtener por ID
router.get('/:id', contenidoController.getById);

// --- RUTAS PENDIENTES (Las descomentaremos luego) ---
// router.get('/:id', (req, res) => { ... });
// router.post('/', (req, res) => { ... });
// router.put('/:id', (req, res) => { ... });
// router.delete('/:id', (req, res) => { ... });

module.exports = router;
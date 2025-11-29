const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenidoController'); // Importamos al Controlador

/**
 * @swagger
 * components:
 *   schemas:
 *     Contenido:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado
 *         titulo:
 *           type: string
 *           description: Título de la película o serie
 *         categoria_id:
 *           type: integer
 *           description: 1 para Serie, 2 para Película
 */

// --- 1. RUTAS ESPECÍFICAS ---

/**
 * @swagger
 * /contenido/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Filtros]
 *     responses:
 *       '200':
 *         description: Lista de categorías
 */

// filtro : categorias
router.get('/categorias', contenidoController.listCategorias);

/**
 * @swagger
 * /contenido/generos:
 *   get:
 *     summary: Obtener todos los géneros
 *     tags: [Filtros]
 *     responses:
 *       '200':
 *         description: Lista de géneros
 */

// filtro : generos
router.get('/generos', contenidoController.listGeneros);

/**
 * @swagger
 * /contenido/actores:
 *   get:
 *     summary: Obtener todos los actores
 *     tags: [Filtros]
 *     responses:
 *       '200':
 *         description: Lista de actores
 */

// filtro : actores
router.get('/actores', contenidoController.listActores);

// --- 2. RUTAS GENERALES ---

/**
 * @swagger
 * /contenido:
 *   get:
 *     summary: Obtener todo el catálogo (permite filtrar por titulo, genero, categoria)
 *     tags: [Contenido]
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Filtrar por título
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Filtrar por género
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (Serie/Película)
 *     responses:
 *       '200':
 *         description: Lista de contenidos
 *       '404':
 *         description: No se encontraron coincidencias
 */

//funcion listar todo
router.get('/', contenidoController.list);     // GET /contenido

/**
 * @swagger
 * /contenido:
 *   post:
 *     summary: Crear un nuevo contenido
 *     tags: [Contenido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contenido'
 *     responses:
 *       '201':
 *         description: Contenido creado exitosamente
 *       '400':
 *         description: Datos faltantes (título obligatorio)
 */

//funcion crear nuevo contenido
router.post('/', contenidoController.create);  // POST /contenido

// --- 3. RUTAS DINÁMICAS (ID) ---

/**
 * @swagger
 * /contenido/{id}:
 *   get:
 *     summary: Obtener un contenido por su ID
 *     tags: [Contenido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Detalle del contenido
 *       '404':
 *         description: Contenido no encontrado
 */

//funcion buscar por id
router.get('/:id', contenidoController.getById);

/**
 * @swagger
 * /contenido/{id}:
 *   put:
 *     summary: Actualizar un contenido completo
 *     tags: [Contenido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contenido'
 *     responses:
 *       '200':
 *         description: Contenido actualizado
 *       '404':
 *         description: Contenido no encontrado
 */

//funcion actualizar contenido
router.put('/:id', contenidoController.update);

/**
 * @swagger
 * /contenido/{id}:
 *   delete:
 *     summary: Eliminar un contenido
 *     tags: [Contenido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Contenido eliminado
 *       '404':
 *         description: Contenido no encontrado
 */

//funcion eliminar contenido
router.delete('/:id', contenidoController.delete);

/**
 * @swagger
 * /contenido/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un contenido
 *     tags: [Contenido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Contenido actualizado
 */

//funcion actualizar parcialmente contenido
router.patch('/:id', contenidoController.update);

module.exports = router;
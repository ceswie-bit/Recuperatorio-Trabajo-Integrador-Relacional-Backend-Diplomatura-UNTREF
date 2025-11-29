const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenidoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contenido:
 *       type: object
 *       required:
 *         - titulo
 *         - categoria_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado de la base de datos
 *         titulo:
 *           type: string
 *           description: Título de la película o serie
 *         poster:
 *           type: string
 *           description: URL de la imagen del poster
 *         resumen:
 *           type: string
 *           description: Sinopsis del contenido
 *         temporadas:
 *           type: integer
 *           nullable: true
 *           description: Número de temporadas (null si es película)
 *         duracion:
 *           type: integer
 *           nullable: true
 *           description: Duración en minutos (null si es serie)
 *         trailer:
 *           type: string
 *           description: URL del video de YouTube
 *         categoria_id:
 *           type: integer
 *           description: 1 para Serie, 2 para Película
 *       example:
 *         titulo: "Gladiador"
 *         poster: "/posters/gladiador.jpg"
 *         resumen: "Un general romano es traicionado y se convierte en esclavo."
 *         temporadas: null
 *         duracion: 155
 *         trailer: "https://www.youtube.com/watch?v=gladiador"
 *         categoria_id: 2
 */

// --- 1. RUTAS ESPECÍFICAS (Van PRIMERO) ---

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
router.get('/actores', contenidoController.listActores);


// --- 2. RUTAS GENERALES ---

/**
 * @swagger
 * /contenido:
 *   get:
 *     summary: Obtener todo el catálogo
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
router.get('/', contenidoController.list);

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
router.post('/', contenidoController.create);


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
router.patch('/:id', contenidoController.update);

module.exports = router;
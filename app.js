const express = require('express');
const app = express();
const contenidoRoutes = require('./routes/contenidoRoutes');
const db = require('./conexion/database');

// --- 1. CONFIGURACIÓN SWAGGER ---
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TrailerFlix API',
            version: '1.0.0',
            description: 'API para gestionar un catálogo de películas y series - Proyecto Integrador',
        },
        servers: [
            { url: 'http://localhost:3000' }
        ],
    },
    apis: ['./routes/*.js'], // Lee los comentarios en las rutas
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
// -----------------------------

// Middlewares
app.use(express.json());

// --- 2. RUTA DE DOCUMENTACIÓN (¡Va PRIMERO!) ---
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// --- 3. RUTAS DE LA API ---
app.use('/contenido', contenidoRoutes);

// --- 4. MANEJO DE ERROR 404 
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
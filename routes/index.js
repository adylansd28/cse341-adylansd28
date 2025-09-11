const router = require('express').Router();

// Documentación Swagger montada en /api-docs
router.use('/api-docs', require('./swagger'));

// Ruta raíz
router.get('/', (req, res) => {
  // #swagger.tags = ['Hello World']
  // #swagger.description = 'Endpoint de prueba que devuelve Hello World'
  res.send('Hello World');
});

// Rutas de usuarios
router.use('/users', require('./users'));

module.exports = router;


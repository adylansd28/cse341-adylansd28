const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

// Body Parser (según lo pedido en clase)
app.use(bodyParser.json());                          // JSON
app.use(bodyParser.urlencoded({ extended: true }));  // Formularios

// Configuración CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Monta el router índice (routes/index.js → Hello World, swagger, users, etc.)
app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => console.log(`Server on port ${port}`));
  }
});

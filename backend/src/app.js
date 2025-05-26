const express = require('express');
const cors = require('cors');
const artigoRoutes = require('./routes/artigoRoutes');
const autorRoutes = require('./routes/autorRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/artigos', artigoRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/cursos', cursoRoutes);

// Testar conexão com o DB
sequelize.authenticate()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados.'))
  .catch(err => console.error('Erro de conexão:', err));

sequelize.sync(); // Cria tabelas se não existirem

module.exports = app;

const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', projectRoutes);

// Testar conexão com o DB
sequelize.authenticate()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados.'))
  .catch(err => console.error('Erro de conexão:', err));

sequelize.sync(); // Cria tabelas se não existirem

module.exports = app;

const express = require('express');
const cors = require('cors');
const artigoRoutes = require('./routes/artigoRoutes');
const autorRoutes = require('./routes/autorRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/db');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*', // Em produção, especifique o domínio do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas
app.use('/api/artigos', artigoRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API está funcionando!' });
});

// Testar conexão com o DB
sequelize.authenticate()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados.'))
  .catch(err => console.error('Erro de conexão:', err));

sequelize.sync(); // Cria tabelas se não existirem

module.exports = app;

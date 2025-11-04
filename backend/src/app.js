const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const artigoRoutes = require('./routes/artigoRoutes');
const autorRoutes = require('./routes/autorRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Configuração do CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do Repositório Digital IFPR',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
      auth: '/api/auth',
      artigos: '/api/artigos',
      autores: '/api/autores',
      cursos: '/api/cursos',
      users: '/api/users'
    }
  });
});

// Rotas da API
app.use('/api/artigos', artigoRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Rota de teste do banco de dados
app.get('/api/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    res.json({
      status: 'success',
      message: 'Conexão com o MongoDB estabelecida com sucesso',
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.name,
        host: mongoose.connection.host
      },
      config: {
        uri: process.env.MONGODB_URI ? 'Configurado' : 'Não configurado'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao testar banco de dados:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao conectar com o MongoDB',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rota de teste
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const isConnected = mongoose.connection.readyState === 1;
    
    res.json({ 
      status: 'ok', 
      message: 'API está funcionando!',
      database: isConnected ? 'conectado' : 'desconectado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao verificar saúde da API:', error);
    res.status(500).json({
      status: 'error',
      message: 'API está com problemas',
      database: 'desconectado',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe',
    path: req.path
  });
});

// Middleware para tratar erros
app.use((err, req, res, next) => {
  console.error('Erro na API:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message,
    path: req.path
  });
});

module.exports = app;

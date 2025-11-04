// Carrega variáveis de ambiente do config.env (desenvolvimento) ou do sistema (produção)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').join(__dirname, '../config.env') });
} else {
  require('dotenv').config();
}
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 MongoDB conectado com sucesso!`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

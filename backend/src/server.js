// Usa variáveis de ambiente do sistema (configuradas no Render ou via sistema)
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

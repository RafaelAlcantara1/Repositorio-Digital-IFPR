// Usa variáveis de ambiente do sistema (configuradas no Render ou via sistema)
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    console.log(`📝 Porta: ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
    
    // Conectar ao MongoDB primeiro
    console.log('📊 Conectando ao banco de dados...');
    await connectDB();
    
    // Iniciar servidor após conexão bem-sucedida
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 MongoDB conectado com sucesso!`);
      console.log('═══════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

startServer();

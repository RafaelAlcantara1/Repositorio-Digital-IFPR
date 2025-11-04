const mongoose = require('mongoose');
// Nota: Este script usa variáveis de ambiente do sistema
// Configure MONGODB_URI antes de executar

async function testConnection() {
  try {
    console.log('🔌 Testando conexão com MongoDB Atlas...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar operações básicas
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Coleções encontradas:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('🔌 Conexão fechada.');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  }
}

testConnection();

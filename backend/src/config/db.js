const mongoose = require('mongoose');

/**
 * Conecta ao banco de dados MongoDB
 * Requer MONGODB_URI nas variáveis de ambiente do sistema
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
    }

    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority'
      }
    );

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB:', error);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('🔍 Possíveis soluções:');
      console.error('1. Verifique se o IP atual está na whitelist do MongoDB Atlas');
      console.error('2. Verifique se as credenciais estão corretas');
      console.error('3. Verifique se o cluster está ativo');
      console.error('4. Tente acessar: https://cloud.mongodb.com/');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');
require('dotenv').config();

// Log das variáveis de ambiente
console.log('Configuração do banco de dados MongoDB:');
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'mongodb+srv://repositorioUser:mr00bullhave@repositorioifpr.yrpdekc.mongodb.net/');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb+srv://repositorioUser:mr00bullhave@repositorioifpr.yrpdekc.mongodb.net/repositorio',
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
    
    // Log mais detalhado do erro
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

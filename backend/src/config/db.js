const mongoose = require('mongoose');

/**
 * Conecta ao banco de dados MongoDB
 * Requer MONGODB_URI nas variáveis de ambiente do sistema
 */
const connectDB = async () => {
  try {
    console.log('🔌 Iniciando conexão com MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
    }

    // Log da URI (sem mostrar senha completa)
    const uriParts = process.env.MONGODB_URI.split('@');
    if (uriParts.length > 1) {
      console.log('📍 MongoDB URI:', uriParts[0].split('://')[0] + '://***@' + uriParts[1].split('/')[0]);
    } else {
      console.log('📍 MongoDB URI configurada (ocultando credenciais)');
    }

    // Configurar eventos do mongoose para debug
    mongoose.connection.on('connecting', () => {
      console.log('🔄 Conectando ao MongoDB...');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose conectado ao MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão do Mongoose:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose desconectado do MongoDB');
    });

    // Tentar conectar com timeouts maiores para Render
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 30000, // Aumentado para 30 segundos
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000, // Timeout de conexão
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority'
      }
    );

    console.log(`✅ MongoDB conectado com sucesso!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o MongoDB:', error.message);
    console.error('   Tipo do erro:', error.name);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('');
      console.error('🔍 Possíveis soluções:');
      console.error('1. Verifique se o IP do Render está na whitelist do MongoDB Atlas');
      console.error('   → No MongoDB Atlas, vá em Network Access e adicione 0.0.0.0/0 (permite todos)');
      console.error('2. Verifique se as credenciais na MONGODB_URI estão corretas');
      console.error('3. Verifique se o cluster está ativo no MongoDB Atlas');
      console.error('4. Verifique se a string de conexão está completa (incluindo /repositorio)');
      console.error('5. Acesse: https://cloud.mongodb.com/');
    } else if (error.message.includes('authentication')) {
      console.error('');
      console.error('🔍 Erro de autenticação:');
      console.error('1. Verifique se o usuário e senha no MONGODB_URI estão corretos');
      console.error('2. Verifique se o usuário tem permissões no banco de dados');
    }
    
    console.error('');
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;

const connectDB = require('../config/db');
const User = require('../models/userModel');

async function countUsers() {
  try {
    console.log('Conectando ao MongoDB...');
    await connectDB();
    console.log('Conexão estabelecida com sucesso!\n');

    // Contar total de usuários
    const totalUsers = await User.countDocuments();
    
    // Contar por role
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Listar todos os usuários (sem senha)
    const users = await User.find({}, 'username role createdAt').sort({ createdAt: -1 });

    console.log('═══════════════════════════════════════');
    console.log('📊 ESTATÍSTICAS DE USUÁRIOS');
    console.log('═══════════════════════════════════════\n');
    
    console.log(`Total de usuários: ${totalUsers}`);
    console.log(`├─ Administradores: ${adminUsers}`);
    console.log(`└─ Usuários regulares: ${regularUsers}\n`);

    if (users.length > 0) {
      console.log('═══════════════════════════════════════');
      console.log('👥 LISTA DE USUÁRIOS');
      console.log('═══════════════════════════════════════\n');
      
      users.forEach((user, index) => {
        const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A';
        console.log(`${index + 1}. ${user.username} (${user.role}) - Criado em: ${date}`);
      });
    } else {
      console.log('Nenhum usuário encontrado no banco de dados.');
    }

  } catch (error) {
    console.error('❌ Erro ao contar usuários:', error);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('\n✅ Conexão fechada.');
    process.exit();
  }
}

countUsers();


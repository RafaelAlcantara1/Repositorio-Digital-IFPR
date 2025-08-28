const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/userModel');

async function createUser() {
  try {
    console.log('Iniciando criação do usuário...');
    
    // Conectar ao MongoDB
    console.log('Conectando ao MongoDB...');
    await connectDB();
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
    
    // Verificar se o usuário já existe
    console.log('Verificando se o usuário já existe...');
    const existingUser = await User.findOne({ username: 'rafael' });
    
    if (existingUser) {
      console.log('Usuário já existe. Atualizando senha...');
      const hashedPassword = await bcrypt.hash('rafael', 10);
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('Usuário atualizado com sucesso!');
    } else {
      // Criar hash da senha
      console.log('Criando hash da senha...');
      const hashedPassword = await bcrypt.hash('rafael', 10);
      
      // Criar o usuário
      console.log('Criando novo usuário...');
      const user = new User({
        username: 'rafael',
        password: hashedPassword,
        role: 'admin'
      });
      
      const savedUser = await user.save();
      
      console.log('Usuário criado com sucesso!');
      console.log('Username:', savedUser.username);
      console.log('Role:', savedUser.role);
    }
    
  } catch (error) {
    console.error('Erro detalhado:', error);
    if (error.code === 11000) {
      console.error('Erro: Já existe um usuário com este nome de usuário.');
    } else {
      console.error('Erro ao criar usuário:', error.message);
    }
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    process.exit();
  }
}

createUser(); 
const bcrypt = require('bcryptjs');
const readline = require('readline');
const connectDB = require('../config/db');
const User = require('../models/userModel');

// Criar interface para ler input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para ler input de forma segura
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  try {
    // Obter credenciais via argumentos de linha de comando ou variáveis de ambiente
    let username = process.argv[2] || process.env.ADMIN_USERNAME;
    let password = process.argv[3] || process.env.ADMIN_PASSWORD;
    let role = process.argv[4] || process.env.ADMIN_ROLE || 'admin';

    // Se não fornecido via argumentos ou env, solicitar input
    if (!username) {
      username = await question('Digite o nome de usuário: ');
    }
    
    if (!password) {
      password = await question('Digite a senha: ');
    }

    if (!username || !password) {
      console.error('Erro: Username e senha são obrigatórios!');
      console.log('\nUso: node createUser.js [username] [password] [role]');
      console.log('Ou defina as variáveis de ambiente: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_ROLE');
      process.exit(1);
    }

    console.log('Iniciando criação do usuário...');
    
    // Conectar ao MongoDB
    console.log('Conectando ao MongoDB...');
    await connectDB();
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
    
    // Verificar se o usuário já existe
    console.log('Verificando se o usuário já existe...');
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      console.log('Usuário já existe. Atualizando senha...');
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      existingUser.role = role;
      await existingUser.save();
      console.log('Usuário atualizado com sucesso!');
      console.log('Username:', existingUser.username);
      console.log('Role:', existingUser.role);
    } else {
      // Criar hash da senha
      console.log('Criando hash da senha...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Criar o usuário
      console.log('Criando novo usuário...');
      const user = new User({
        username,
        password: hashedPassword,
        role
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
    rl.close();
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    process.exit();
  }
}

createUser(); 
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const sequelize = require('../config/db');

async function createUser() {
  try {
    console.log('Iniciando criação do usuário...');
    
    // Testar conexão com o banco de dados
    console.log('Testando conexão com o banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    
    // Sincronizar o modelo com o banco de dados
    console.log('Sincronizando modelo com o banco de dados...');
    await sequelize.sync({ force: false });
    console.log('Modelo sincronizado com sucesso!');
    
    // Verificar se o usuário já existe
    console.log('Verificando se o usuário já existe...');
    const existingUser = await User.findOne({
      where: { username: 'o mais bonito' }
    });
    
    if (existingUser) {
      console.log('Usuário já existe. Atualizando senha...');
      const hashedPassword = await bcrypt.hash('rafaelbonito', 10);
      await existingUser.update({
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Usuário atualizado com sucesso!');
    } else {
      // Criar hash da senha
      console.log('Criando hash da senha...');
      const hashedPassword = await bcrypt.hash('rafaelbonito', 10);
      
      // Criar o usuário
      console.log('Criando novo usuário...');
      const user = await User.create({
        username: 'o mais bonito',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Usuário criado com sucesso!');
      console.log('Username:', user.username);
      console.log('Role:', user.role);
    }
    
  } catch (error) {
    console.error('Erro detalhado:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Erro: Já existe um usuário com este nome de usuário.');
    } else if (error.name === 'SequelizeConnectionError') {
      console.error('Erro de conexão com o banco de dados:', error.message);
    } else {
      console.error('Erro ao criar usuário:', error.message);
    }
  } finally {
    await sequelize.close();
    process.exit();
  }
}

createUser(); 
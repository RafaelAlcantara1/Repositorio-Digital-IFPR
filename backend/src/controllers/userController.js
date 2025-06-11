const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Criar um novo usuário
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'user'
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Listar todos os usuários
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'createdAt']
    });
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Atualizar um usuário
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;
    
    await user.update(updateData);
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Deletar um usuário
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    await user.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser
}; 
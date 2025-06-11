const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'seu_segredo_jwt_aqui'; // Em produção, use uma variável de ambiente

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  login
}; 
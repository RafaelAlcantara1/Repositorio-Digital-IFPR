const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definida nas variáveis de ambiente');
}

/**
 * Autentica um usuário e retorna token JWT
 */
const login = async (req, res) => {
  try {
    console.log('=== INÍCIO DO LOGIN ===');
    console.log('Body completo:', JSON.stringify(req.body));
    console.log('Content-Type:', req.get('Content-Type'));
    
    const { username, password } = req.body;

    console.log('Tentativa de login:', { username, hasPassword: !!password });

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e senha são obrigatórios'
      });
    }

    const user = await User.findOne({ username });
    
    if (!user) {
      console.log('Usuário não encontrado:', username);
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }

    console.log('Usuário encontrado:', user.username);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Senha inválida para usuário:', username);
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }

    console.log('Login bem-sucedido para:', username);

    const token = jwt.sign(
      { 
        id: user._id,
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
          id: user._id,
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
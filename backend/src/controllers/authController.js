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

    // Normalizar username (remover espaços e converter para string)
    const normalizedUsername = String(username).trim();

    console.log('Tentativa de login:', { 
      username: normalizedUsername, 
      originalLength: username?.length,
      hasPassword: !!password 
    });

    if (!normalizedUsername || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e senha são obrigatórios'
      });
    }

    // Listar todos os usuários para debug (apenas em caso de erro)
    const allUsers = await User.find({}, 'username');
    console.log('Usuários no banco:', allUsers.map(u => u.username));
    console.log('Buscando usuário:', normalizedUsername);

    // Buscar usuário (case-insensitive)
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${normalizedUsername}$`, 'i') }
    });
    
    if (!user) {
      console.log('Usuário não encontrado:', normalizedUsername);
      console.log('Usuários disponíveis:', allUsers.map(u => `"${u.username}"`).join(', '));
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
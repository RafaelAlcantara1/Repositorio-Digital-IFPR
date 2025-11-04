const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

console.log('Registrando rota POST /login');
router.post('/login', login);
console.log('Rota POST /login registrada');

module.exports = router; 
const mongoose = require('mongoose');

const autorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['orientador', 'coorientador', 'orientando'],
    required: true
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Autor', autorSchema); 
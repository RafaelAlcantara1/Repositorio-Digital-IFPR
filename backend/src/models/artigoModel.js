const mongoose = require('mongoose');

const artigoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  ano: {
    type: Number,
    required: true
  },
  id_curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  palavra_chave: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  autores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Autor'
  }]
}, {
  timestamps: false
});

module.exports = mongoose.model('Artigo', artigoSchema); 
const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  tipo_curso: {
    type: String,
    enum: ['TECNICO_INTEGRADO', 'TECNICO_SUBSEQUENTE', 'SUPERIOR'],
    default: 'TECNICO_INTEGRADO',
    required: true
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Curso', cursoSchema); 
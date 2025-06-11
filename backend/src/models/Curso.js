const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Curso = sequelize.define('Curso', {
  id_curso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_curso: {
    type: DataTypes.ENUM('TECNICO_INTEGRADO', 'TECNICO_SUBSEQUENTE', 'SUPERIOR'),
    allowNull: false,
    defaultValue: 'TECNICO_INTEGRADO'
  }
}, {
  tableName: 'curso',
  timestamps: false
});

module.exports = Curso; 
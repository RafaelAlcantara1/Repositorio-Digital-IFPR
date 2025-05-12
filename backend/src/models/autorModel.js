const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Autor = sequelize.define('Autor', {
  id_autor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(1500),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('orientador', 'coorientador', 'orientando'),
    allowNull: false
  }
}, {
  tableName: 'autor',
  timestamps: false
});

module.exports = Autor; 
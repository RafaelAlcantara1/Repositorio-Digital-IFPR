const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Artigo = sequelize.define('Artigo', {
  id_artigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_curso: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  palavra_chave: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  link: {
    type: DataTypes.STRING(2000),
    allowNull: true
  }
}, {
  tableName: 'artigo',
  timestamps: false
});

module.exports = Artigo; 
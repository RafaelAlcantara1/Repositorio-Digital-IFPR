const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ArtigoAutor = sequelize.define('ArtigoAutor', {
  id_artigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'artigo',
      key: 'id_artigo'
    }
  },
  id_autor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'autor',
      key: 'id_autor'
    }
  }
}, {
  tableName: 'artigo_autor',
  timestamps: false
});

module.exports = ArtigoAutor; 
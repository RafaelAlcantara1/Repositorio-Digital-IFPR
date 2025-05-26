const Artigo = require('./artigoModel');
const Autor = require('./autorModel');
const ArtigoAutor = require('./artigoAutorModel');

// Define relationships
Artigo.belongsToMany(Autor, { 
  through: ArtigoAutor, 
  foreignKey: 'id_artigo',
  as: 'Autores'
});
Autor.belongsToMany(Artigo, { 
  through: ArtigoAutor, 
  foreignKey: 'id_autor',
  as: 'Artigos'
});

module.exports = {
  Artigo,
  Autor,
  ArtigoAutor
}; 
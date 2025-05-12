const Artigo = require('./artigoModel');
const Autor = require('./autorModel');
const ArtigoAutor = require('./artigoAutorModel');

// Define relationships
Artigo.belongsToMany(Autor, { through: ArtigoAutor, foreignKey: 'id_artigo' });
Autor.belongsToMany(Artigo, { through: ArtigoAutor, foreignKey: 'id_autor' });

module.exports = {
  Artigo,
  Autor,
  ArtigoAutor
}; 
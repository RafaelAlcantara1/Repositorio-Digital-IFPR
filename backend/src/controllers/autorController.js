const { Autor } = require('../models');

const autorController = {
  // Listar todos os autores
  async getAll(req, res) {
    try {
      const autores = await Autor.find();
      res.json(autores);
    } catch (error) {
      console.error('Erro ao buscar autores:', error);
      res.status(500).json({ error: 'Erro ao buscar autores' });
    }
  },

  // Buscar autor por ID
  async getById(req, res) {
    try {
      const autor = await Autor.findById(req.params.id);
      
      if (!autor) {
        return res.status(404).json({ error: 'Autor não encontrado' });
      }
      
      res.json(autor);
    } catch (error) {
      console.error('Erro ao buscar autor:', error);
      res.status(500).json({ error: 'Erro ao buscar autor' });
    }
  },

  // Criar novo autor
  async create(req, res) {
    try {
      const { nome, tipo } = req.body;
      
      const autor = new Autor({
        nome,
        tipo
      });

      const savedAutor = await autor.save();
      res.status(201).json(savedAutor);
    } catch (error) {
      console.error('Erro ao criar autor:', error);
      res.status(500).json({ error: 'Erro ao criar autor' });
    }
  },

  // Atualizar autor
  async update(req, res) {
    try {
      const { nome, tipo } = req.body;
      
      const autor = await Autor.findById(req.params.id);
      
      if (!autor) {
        return res.status(404).json({ error: 'Autor não encontrado' });
      }

      autor.nome = nome || autor.nome;
      autor.tipo = tipo || autor.tipo;

      const updatedAutor = await autor.save();
      res.json(updatedAutor);
    } catch (error) {
      console.error('Erro ao atualizar autor:', error);
      res.status(500).json({ error: 'Erro ao atualizar autor' });
    }
  },

  // Deletar autor
  async delete(req, res) {
    try {
      const autor = await Autor.findByIdAndDelete(req.params.id);
      
      if (!autor) {
        return res.status(404).json({ error: 'Autor não encontrado' });
      }

      res.json({ message: 'Autor deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar autor:', error);
      res.status(500).json({ error: 'Erro ao deletar autor' });
    }
  }
};

module.exports = autorController; 
const { Autor } = require('../models');

const autorController = {
  // Listar todos os autores
  async getAll(req, res) {
    try {
      const autores = await Autor.findAll();
      res.json(autores);
    } catch (error) {
      console.error('Erro ao buscar autores:', error);
      res.status(500).json({ error: 'Erro ao buscar autores' });
    }
  },

  // Buscar autor por ID
  async getById(req, res) {
    try {
      const autor = await Autor.findByPk(req.params.id);
      
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
      
      const autor = await Autor.create({
        nome,
        tipo
      });

      res.status(201).json(autor);
    } catch (error) {
      console.error('Erro ao criar autor:', error);
      res.status(500).json({ error: 'Erro ao criar autor' });
    }
  },

  // Atualizar autor
  async update(req, res) {
    try {
      const { nome, tipo } = req.body;
      
      const autor = await Autor.findByPk(req.params.id);
      
      if (!autor) {
        return res.status(404).json({ error: 'Autor não encontrado' });
      }

      await autor.update({
        nome,
        tipo
      });

      res.json(autor);
    } catch (error) {
      console.error('Erro ao atualizar autor:', error);
      res.status(500).json({ error: 'Erro ao atualizar autor' });
    }
  },

  // Deletar autor
  async delete(req, res) {
    try {
      const autor = await Autor.findByPk(req.params.id);
      
      if (!autor) {
        return res.status(404).json({ error: 'Autor não encontrado' });
      }

      await autor.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar autor:', error);
      res.status(500).json({ error: 'Erro ao deletar autor' });
    }
  }
};

module.exports = autorController; 
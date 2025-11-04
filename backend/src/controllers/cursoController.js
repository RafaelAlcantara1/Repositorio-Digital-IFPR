const Curso = require('../models/Curso');
const Artigo = require('../models/artigoModel');

const cursoController = {
  getAllCursos: async (req, res) => {
    try {
      const cursos = await Curso.find();
      res.json(cursos);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
  },

  createCurso: async (req, res) => {
    try {
      const { nome, tipo_curso } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'Nome do curso é obrigatório' });
      }

      if (!tipo_curso) {
        return res.status(400).json({ error: 'Tipo do curso é obrigatório' });
      }

      const curso = new Curso({ nome, tipo_curso });
      const savedCurso = await curso.save();
      res.status(201).json(savedCurso);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      res.status(500).json({ error: 'Erro ao criar curso' });
    }
  },

  deleteCurso: async (req, res) => {
    try {
      const curso = await Curso.findById(req.params.id);
      
      if (!curso) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      // Verificar se existem artigos associados ao curso
      const artigos = await Artigo.find({ id_curso: req.params.id });

      if (artigos.length > 0) {
        return res.status(400).json({ 
          error: 'Não é possível excluir o curso pois existem artigos associados a ele',
          artigosCount: artigos.length
        });
      }

      await Curso.findByIdAndDelete(req.params.id);
      res.json({ message: 'Curso deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      res.status(500).json({ error: 'Erro ao deletar curso' });
    }
  }
};

module.exports = cursoController; 
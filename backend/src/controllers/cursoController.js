const Curso = require('../models/Curso');
const Artigo = require('../models/artigoModel');

const cursoController = {
  getAllCursos: async (req, res) => {
    try {
      console.log('Iniciando busca de cursos...');
      const cursos = await Curso.findAll();
      console.log('Cursos encontrados:', cursos);
      
      // Verificar a estrutura da tabela
      const tableInfo = await Curso.describe();
      console.log('Estrutura da tabela cursos:', tableInfo);
      
      res.json(cursos);
    } catch (error) {
      console.error('Erro detalhado ao buscar cursos:', error);
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

      const curso = await Curso.create({ nome, tipo_curso });
      res.status(201).json(curso);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      res.status(500).json({ error: 'Erro ao criar curso' });
    }
  },

  deleteCurso: async (req, res) => {
    try {
      const curso = await Curso.findByPk(req.params.id);
      
      if (!curso) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      // Verificar se existem artigos associados ao curso
      const artigos = await Artigo.findAll({
        where: { id_curso: req.params.id }
      });

      if (artigos.length > 0) {
        return res.status(400).json({ 
          error: 'Não é possível excluir o curso pois existem artigos associados a ele',
          artigosCount: artigos.length
        });
      }

      await curso.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      res.status(500).json({ error: 'Erro ao deletar curso' });
    }
  }
};

module.exports = cursoController; 
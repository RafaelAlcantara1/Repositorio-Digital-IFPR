const Curso = require('../models/Curso');

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

  deleteCurso: async (req, res) => {
    try {
      const curso = await Curso.findByPk(req.params.id);
      
      if (!curso) {
        return res.status(404).json({ error: 'Curso não encontrado' });
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
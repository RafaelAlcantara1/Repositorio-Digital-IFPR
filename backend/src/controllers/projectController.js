const Project = require('../models/projectModel');

// Buscar todos os projetos
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar projetos.' });
  }
};

// Criar novo projeto
exports.createProject = async (req, res) => {
  const { titulo, descricao, ano, autor } = req.body;

  try {
    const project = await Project.create({ titulo, descricao, ano, autor });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar projeto.' });
  }
};

// Deletar projeto
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    await project.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar projeto.' });
  }
};

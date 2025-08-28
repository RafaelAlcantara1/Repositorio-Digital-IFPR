const Project = require('../models/projectModel');

// Buscar todos os projetos
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar projetos.' });
  }
};

// Criar novo projeto
exports.createProject = async (req, res) => {
  const { titulo, descricao, ano, autor } = req.body;

  try {
    const project = new Project({ titulo, descricao, ano, autor });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar projeto.' });
  }
};

// Deletar projeto
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    res.json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar projeto.' });
  }
};

const connectDB = require('../config/db');
const { Artigo, Autor, Curso, User } = require('../models');

async function migrateData() {
  try {
    console.log('Iniciando migração de dados...');
    
    // Conectar ao MongoDB
    await connectDB();
    console.log('Conectado ao MongoDB');
    
    // Aqui você pode adicionar lógica para migrar dados existentes
    // Por exemplo, se você tiver dados em um arquivo JSON ou CSV
    
    console.log('Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    process.exit();
  }
}

// Função para criar dados de exemplo
async function createSampleData() {
  try {
    console.log('Criando dados de exemplo...');
    
    await connectDB();
    
    // Criar cursos de exemplo
    const curso1 = new Curso({
      nome: 'Técnico em Informática',
      tipo_curso: 'TECNICO_INTEGRADO'
    });
    const savedCurso1 = await curso1.save();
    
    const curso2 = new Curso({
      nome: 'Técnico em Administração',
      tipo_curso: 'TECNICO_SUBSEQUENTE'
    });
    const savedCurso2 = await curso2.save();
    
    // Criar autores de exemplo
    const autor1 = new Autor({
      nome: 'João Silva',
      tipo: 'orientador'
    });
    const savedAutor1 = await autor1.save();
    
    const autor2 = new Autor({
      nome: 'Maria Santos',
      tipo: 'orientando'
    });
    const savedAutor2 = await autor2.save();
    
    // Criar artigos de exemplo
    const artigo1 = new Artigo({
      titulo: 'Desenvolvimento de Sistema Web',
      ano: 2023,
      id_curso: savedCurso1._id,
      palavra_chave: 'web, desenvolvimento, javascript',
      link: 'https://exemplo.com/artigo1',
      autores: [savedAutor1._id, savedAutor2._id]
    });
    await artigo1.save();
    
    const artigo2 = new Artigo({
      titulo: 'Gestão de Projetos',
      ano: 2023,
      id_curso: savedCurso2._id,
      palavra_chave: 'gestão, projetos, administração',
      link: 'https://exemplo.com/artigo2',
      autores: [savedAutor1._id]
    });
    await artigo2.save();
    
    console.log('Dados de exemplo criados com sucesso!');
    
  } catch (error) {
    console.error('Erro ao criar dados de exemplo:', error);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    process.exit();
  }
}

// Verificar argumento da linha de comando
const command = process.argv[2];

if (command === 'sample') {
  createSampleData();
} else {
  migrateData();
}

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://repositorioUser:mr00bullhave@repositorioifpr.yrpdekc.mongodb.net/repositorio');
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Erro ao conectar:', error);
    process.exit(1);
  }
};

const debugData = async () => {
  await connectDB();
  
  const { Artigo, Curso, Autor } = require('./src/models');
  
  console.log('\n=== DADOS COMPLETOS ===\n');
  
  // Buscar o artigo específico
  const artigo = await Artigo.findById('68af54c6c35f2ffb0e8aefdb')
    .populate('autores', 'nome tipo')
    .populate('id_curso', 'nome tipo_curso');
  
  console.log('ARTIGO:', JSON.stringify(artigo, null, 2));
  
  // Buscar todos os cursos
  const cursos = await Curso.find();
  console.log('\nCURSOS:', JSON.stringify(cursos, null, 2));
  
  // Verificar se o id_curso do artigo corresponde a algum curso
  const cursoDoArtigo = cursos.find(curso => curso._id.toString() === artigo.id_curso.toString());
  console.log('\nCURSO DO ARTIGO:', cursoDoArtigo ? cursoDoArtigo.nome : 'NÃO ENCONTRADO');
  
  await mongoose.connection.close();
};

debugData().catch(console.error);

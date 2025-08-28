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

const fixArticle = async () => {
  await connectDB();
  
  const { Artigo } = require('./src/models');
  
  console.log('Corrigindo artigo...');
  
  // Buscar o artigo
  const artigo = await Artigo.findById('68af54c6c35f2ffb0e8aefdb');
  
  if (!artigo) {
    console.log('Artigo não encontrado');
    return;
  }
  
  console.log('Artigo antes da correção:', artigo.id_curso, typeof artigo.id_curso);
  
  // Corrigir o id_curso para ObjectId
  artigo.id_curso = mongoose.Types.ObjectId(artigo.id_curso);
  
  // Salvar o artigo corrigido
  await artigo.save();
  
  console.log('Artigo após a correção:', artigo.id_curso, typeof artigo.id_curso);
  console.log('✅ Artigo corrigido com sucesso!');
  
  await mongoose.connection.close();
};

fixArticle().catch(console.error);

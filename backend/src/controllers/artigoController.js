const { Artigo, Autor } = require('../models');
const mongoose = require('mongoose');

const artigoController = {
  // Listar todos os artigos
  async getAll(req, res) {
    try {
      const artigos = await Artigo.find()
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');
      res.json(artigos);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
  },

  // Buscar artigo por ID
  async getById(req, res) {
    try {
      const artigo = await Artigo.findById(req.params.id)
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');
      
      if (!artigo) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }
      
      res.json(artigo);
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
      res.status(500).json({ error: 'Erro ao buscar artigo' });
    }
  },

  // Criar novo artigo
  async create(req, res) {
    try {
      console.log('Dados recebidos para criar artigo:', req.body);
      const { titulo, ano, id_curso, palavra_chave, link, autores } = req.body;
      
      console.log('Criando artigo com os dados:', {
        titulo,
        ano,
        id_curso,
        palavra_chave,
        link
      });

      // Criar o artigo
      const artigo = new Artigo({
        titulo,
        ano,
        id_curso: id_curso, // Mongoose fará a conversão automaticamente
        palavra_chave,
        link,
        autores: []
      });

      if (autores && autores.length > 0) {
        console.log('Processando autores:', autores);
        
        // Criar os autores e obter seus IDs
        const autoresCriados = await Promise.all(
          autores.map(async (autorData) => {
            const autor = new Autor({
              nome: autorData.nome,
              tipo: autorData.tipo
            });
            const savedAutor = await autor.save();
            return savedAutor._id;
          })
        );

        artigo.autores = autoresCriados;
      }

      const savedArtigo = await artigo.save();

      const artigoComAutores = await Artigo.findById(savedArtigo._id)
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');

      console.log('Artigo final com autores:', artigoComAutores);
      res.status(201).json(artigoComAutores);
    } catch (error) {
      console.error('Erro detalhado ao criar artigo:', error);
      res.status(500).json({ 
        error: 'Erro ao criar artigo',
        details: error.message 
      });
    }
  },

  // Atualizar artigo
  async update(req, res) {
    try {
      console.log('Dados recebidos para atualizar artigo:', req.body);
      console.log('ID do artigo a ser atualizado:', req.params.id);
      
      const { titulo, ano, id_curso, palavra_chave, link, autores } = req.body;
      
      const artigo = await Artigo.findById(req.params.id);
      if (!artigo) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      console.log('Artigo encontrado:', artigo);

      // Atualizar campos básicos
      artigo.titulo = titulo || artigo.titulo;
      artigo.ano = ano || artigo.ano;
      
      console.log('ID do curso recebido:', id_curso);
      console.log('Tipo do ID do curso:', typeof id_curso);
      
                    if (id_curso) {
         artigo.id_curso = id_curso;
         console.log('ID do curso atribuído:', id_curso);
       }
      
      artigo.palavra_chave = palavra_chave || artigo.palavra_chave;
      artigo.link = link || artigo.link;

      // Atualizar autores se fornecidos
      if (autores && autores.length > 0) {
        console.log('Processando autores para atualização:', autores);
        
        // Verificar se os autores já existem antes de criar novos
        const autoresExistentes = await Autor.find({
          nome: { $in: autores.map(a => a.nome) },
          tipo: { $in: autores.map(a => a.tipo) }
        });
        
        console.log('Autores existentes encontrados:', autoresExistentes);
        
        // Criar apenas autores que não existem
        const autoresParaCriar = autores.filter(autorData => 
          !autoresExistentes.some(existente => 
            existente.nome === autorData.nome && existente.tipo === autorData.tipo
          )
        );
        
        console.log('Autores para criar:', autoresParaCriar);
        
        if (autoresParaCriar.length > 0) {
          const novosAutores = await Promise.all(
            autoresParaCriar.map(async (autorData) => {
              const autor = new Autor({
                nome: autorData.nome,
                tipo: autorData.tipo
              });
              const savedAutor = await autor.save();
              return savedAutor._id;
            })
          );
          
          // Combinar autores existentes com novos
          const todosAutores = [
            ...autoresExistentes.map(a => a._id),
            ...novosAutores
          ];
          artigo.autores = todosAutores;
        } else {
          artigo.autores = autoresExistentes.map(a => a._id);
        }
        
        console.log('Autores atualizados com sucesso');
      }

      console.log('Salvando artigo atualizado...');
      const updatedArtigo = await artigo.save();
      console.log('Artigo salvo com sucesso');
      
      const artigoComAutores = await Artigo.findById(updatedArtigo._id)
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');

      res.json(artigoComAutores);
    } catch (error) {
      console.error('Erro detalhado ao atualizar artigo:', error);
      res.status(500).json({ 
        error: 'Erro ao atualizar artigo',
        details: error.message 
      });
    }
  },

  // Deletar artigo
  async delete(req, res) {
    try {
      console.log('Tentando deletar artigo com ID:', req.params.id);
      console.log('Tipo do ID:', typeof req.params.id);
      console.log('ID é válido?', req.params.id && req.params.id !== 'undefined');
      
      if (!req.params.id || req.params.id === 'undefined') {
        return res.status(400).json({ error: 'ID do artigo é obrigatório' });
      }
      
      const artigo = await Artigo.findByIdAndDelete(req.params.id);
      
      if (!artigo) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }
      
      console.log('Artigo deletado com sucesso:', artigo._id);
      res.json({ message: 'Artigo deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      res.status(500).json({ error: 'Erro ao deletar artigo' });
    }
  },

  // Buscar artigos por curso
  async getByCurso(req, res) {
    try {
      const artigos = await Artigo.find({ id_curso: req.params.cursoId })
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');
      res.json(artigos);
    } catch (error) {
      console.error('Erro ao buscar artigos por curso:', error);
      res.status(500).json({ error: 'Erro ao buscar artigos por curso' });
    }
  },

  // Buscar artigos por ano
  async getByAno(req, res) {
    try {
      const artigos = await Artigo.find({ ano: req.params.ano })
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');
      res.json(artigos);
    } catch (error) {
      console.error('Erro ao buscar artigos por ano:', error);
      res.status(500).json({ error: 'Erro ao buscar artigos por ano' });
    }
  }
};

module.exports = artigoController; 
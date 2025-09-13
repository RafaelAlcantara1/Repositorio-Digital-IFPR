const { Artigo, Autor } = require('../models');
const mongoose = require('mongoose');

const artigoController = {
  // Listar todos os artigos com paginação
  async getAll(req, res) {
    try {
      const { page = 1, limit = 6, cursoId } = req.query;
      const skip = (page - 1) * limit;
      
      let query = {};
      
      // Se um curso específico foi solicitado, filtrar por ele
      if (cursoId) {
        query.id_curso = cursoId;
      }
      
      const artigos = await Artigo.find(query)
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ ano: -1, titulo: 1 }); // Ordenar por ano decrescente e título
      
      // Contar total de artigos para paginação
      const total = await Artigo.countDocuments(query);
      
      res.json({
        artigos,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: skip + artigos.length < total,
          hasPrevPage: page > 1
        }
      });
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

      // Atualizar autores se fornecidos (mesmo que seja uma lista vazia)
      if (autores !== undefined) {
        console.log('Processando autores para atualização:', autores);
        
        // Primeiro, remover todos os autores atuais do artigo
        artigo.autores = [];
        
        // Se há autores para processar
        if (autores && autores.length > 0) {
          // Processar cada autor individualmente
          const autoresIds = [];
          
          for (const autorData of autores) {
            // Verificar se já existe um autor com exatamente o mesmo nome e tipo
            let autorExistente = await Autor.findOne({
              nome: autorData.nome,
              tipo: autorData.tipo
            });
            
            if (autorExistente) {
              // Usar o autor existente
              autoresIds.push(autorExistente._id);
              console.log('Usando autor existente:', autorExistente.nome);
            } else {
              // Criar novo autor
              const novoAutor = new Autor({
                nome: autorData.nome,
                tipo: autorData.tipo
              });
              const savedAutor = await novoAutor.save();
              autoresIds.push(savedAutor._id);
              console.log('Criado novo autor:', savedAutor.nome);
            }
          }
          
          // Atribuir os IDs dos autores ao artigo
          artigo.autores = autoresIds;
        }
        
        console.log('Autores atualizados com sucesso. Total de autores:', artigo.autores.length);
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

  // Buscar artigos por curso com paginação
  async getByCurso(req, res) {
    try {
      const { cursoId } = req.params;
      const { page = 1, limit = 6 } = req.query;
      const skip = (page - 1) * limit;
      
      const artigos = await Artigo.find({ id_curso: cursoId })
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ ano: -1, titulo: 1 });
      
      // Contar total de artigos do curso
      const total = await Artigo.countDocuments({ id_curso: cursoId });
      
      res.json({
        artigos,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: skip + artigos.length < total,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error('Erro ao buscar artigos do curso:', error);
      res.status(500).json({ error: 'Erro ao buscar artigos do curso' });
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
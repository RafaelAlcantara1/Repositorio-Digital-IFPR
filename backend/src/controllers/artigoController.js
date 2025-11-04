const { Artigo, Autor } = require('../models');
const mongoose = require('mongoose');

const artigoController = {
  /**
   * Lista todos os artigos com autores e curso populados
   */
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

      res.status(201).json(artigoComAutores);
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      res.status(500).json({ 
        error: 'Erro ao criar artigo',
        details: error.message 
      });
    }
  },

  /**
   * Atualiza um artigo existente
   * Processa autores individualmente para evitar duplicações
   */
  async update(req, res) {
    try {
      const { titulo, ano, id_curso, palavra_chave, link, autores } = req.body;
      
      const artigo = await Artigo.findById(req.params.id);
      if (!artigo) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      artigo.titulo = titulo || artigo.titulo;
      artigo.ano = ano || artigo.ano;
      
      if (id_curso) {
        artigo.id_curso = id_curso;
      }
      
      artigo.palavra_chave = palavra_chave || artigo.palavra_chave;
      artigo.link = link || artigo.link;

      if (autores && autores.length > 0) {
        const autoresIds = await Promise.all(
          autores.map(async (autorData) => {
            let autorExistente = await Autor.findOne({
              nome: autorData.nome,
              tipo: autorData.tipo
            });
            
            if (!autorExistente) {
              autorExistente = new Autor({
                nome: autorData.nome,
                tipo: autorData.tipo
              });
              await autorExistente.save();
            }
            
            return autorExistente._id;
          })
        );
        
        artigo.autores = autoresIds;
      }

      const updatedArtigo = await artigo.save();
      
      const artigoComAutores = await Artigo.findById(updatedArtigo._id)
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');

      res.json(artigoComAutores);
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      res.status(500).json({ 
        error: 'Erro ao atualizar artigo',
        details: error.message 
      });
    }
  },

  /**
   * Deleta um artigo por ID
   */
  async delete(req, res) {
    try {
      if (!req.params.id || req.params.id === 'undefined') {
        return res.status(400).json({ error: 'ID do artigo é obrigatório' });
      }
      
      const artigo = await Artigo.findByIdAndDelete(req.params.id);
      
      if (!artigo) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }
      
      res.json({ message: 'Artigo deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      res.status(500).json({ error: 'Erro ao deletar artigo' });
    }
  },

  /**
   * Busca artigos de um curso específico
   */
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

  /**
   * Busca artigos de um ano específico
   */
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
  },

  /**
   * Retorna o último artigo cadastrado (mais recente)
   */
  async getLast(req, res) {
    try {
      const ultimoArtigo = await Artigo.findOne()
        .sort({ _id: -1 })
        .populate('autores', 'nome tipo')
        .populate('id_curso', 'nome tipo_curso');
      
      if (!ultimoArtigo) {
        return res.status(404).json({ error: 'Nenhum artigo encontrado' });
      }
      
      res.json(ultimoArtigo);
    } catch (error) {
      console.error('Erro ao buscar último artigo:', error);
      res.status(500).json({ error: 'Erro ao buscar último artigo' });
    }
  }
};

module.exports = artigoController; 
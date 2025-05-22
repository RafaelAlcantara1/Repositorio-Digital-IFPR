const { Artigo, Autor, ArtigoAutor } = require('../models');

const artigoController = {
  // Listar todos os artigos
  async getAll(req, res) {
    try {
      const artigos = await Artigo.findAll({
        include: [{
          model: Autor,
          as: 'Autores',
          through: { attributes: [] } // Não inclui atributos da tabela de junção
        }]
      });
      res.json(artigos);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
  },

  // Buscar artigo por ID
  async getById(req, res) {
    try {
      const artigo = await Artigo.findByPk(req.params.id, {
        include: [{
          model: Autor,
          as: 'Autores',
          through: { attributes: [] }
        }]
      });
      
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
      const artigo = await Artigo.create({
        titulo,
        ano,
        id_curso,
        palavra_chave,
        link
      });

      console.log('Artigo criado:', artigo);

      if (autores && autores.length > 0) {
        console.log('Processando autores:', autores);
        
        // Criar os autores e obter seus IDs
        const autoresCriados = await Promise.all(
          autores.map(async (autorData) => {
            const autor = await Autor.create({
              nome: autorData.nome,
              tipo: autorData.tipo
            });
            return autor;
          })
        );

        // Associar os autores ao artigo
        await artigo.setAutores(autoresCriados);
        console.log('Autores associados com sucesso');
      }

      const artigoComAutores = await Artigo.findByPk(artigo.id_artigo, {
        include: [{
          model: Autor,
          as: 'Autores',
          through: { attributes: [] }
        }]
      });

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
      const { titulo, ano, id_curso, palavra_chave, link, autores } = req.body;
      
      const artigo = await Artigo.findByPk(req.params.id);
      
      if (!artigo) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      await artigo.update({
        titulo,
        ano,
        id_curso,
        palavra_chave,
        link
      });

      if (autores) {
        await artigo.setAutores(autores);
      }

      const artigoAtualizado = await Artigo.findByPk(artigo.id_artigo, {
        include: [{
          model: Autor,
          as: 'Autores',
          through: { attributes: [] }
        }]
      });

      res.json(artigoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      res.status(500).json({ error: 'Erro ao atualizar artigo' });
    }
  },

  // Deletar artigo
  async delete(req, res) {
    try {
      const artigo = await Artigo.findByPk(req.params.id);
      
      if (!artigo) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      await artigo.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      res.status(500).json({ error: 'Erro ao deletar artigo' });
    }
  }
};

module.exports = artigoController; 
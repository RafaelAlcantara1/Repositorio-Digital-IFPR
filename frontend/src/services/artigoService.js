import { api } from './api';

export const artigoService = {
  // Get all articles
  getAll: async () => {
    const response = await api.get('/artigos');
    return response.data;
  },

  // Get article by ID
  getById: async (id) => {
    const response = await api.get(`/artigos/${id}`);
    return response.data;
  },

  // Create new article
  create: async (artigoData) => {
    const response = await api.post('/artigos', artigoData);
    return response.data;
  },

  // Update article
  update: async (id, artigoData) => {
    const response = await api.put(`/artigos/${id}`, artigoData);
    return response.data;
  },

  // Delete article
  delete: async (id) => {
    console.log('Serviço: Tentando deletar artigo com ID:', id);
    console.log('Serviço: Tipo do ID:', typeof id);
    console.log('Serviço: URL da requisição:', `/artigos/${id}`);
    
    if (!id || id === 'undefined') {
      throw new Error('ID do artigo é obrigatório');
    }
    
    const response = await api.delete(`/artigos/${id}`);
    return response.data;
  }
}; 
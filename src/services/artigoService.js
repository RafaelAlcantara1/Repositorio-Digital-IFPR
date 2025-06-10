import { api } from './api';

export const artigoService = {
  // Get all articles
  getAll: async () => {
    const response = await api.get('/artigos', {
      params: {
        include: 'Autores'
      }
    });
    return response.data;
  },

  // Get article by ID
  getById: async (id) => {
    const response = await api.get(`/artigos/${id}`, {
      params: {
        include: 'Autores'
      }
    });
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
    const response = await api.delete(`/artigos/${id}`);
    return response.data;
  }
}; 
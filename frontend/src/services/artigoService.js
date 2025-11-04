import { api } from './api';

export const artigoService = {
  getAll: async (page = 1, limit = 6, cursoId = null) => {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page);
    if (limit !== 6) params.append('limit', limit);
    if (cursoId) params.append('cursoId', cursoId);
    
    const response = await api.get(`/api/artigos?${params.toString()}`);
    return response.data;
  },

  getByCurso: async (cursoId, page = 1, limit = 6) => {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page);
    if (limit !== 6) params.append('limit', limit);
    
    const response = await api.get(`/api/artigos/curso/${cursoId}?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/artigos/${id}`);
    return response.data;
  },

  create: async (artigoData) => {
    const response = await api.post('/api/artigos', artigoData);
    return response.data;
  },

  update: async (id, artigoData) => {
    const response = await api.put(`/api/artigos/${id}`, artigoData);
    return response.data;
  },

  delete: async (id) => {
    if (!id || id === 'undefined') {
      throw new Error('ID do artigo é obrigatório');
    }
    
    const response = await api.delete(`/api/artigos/${id}`);
    return response.data;
  },

  getLast: async () => {
    const response = await api.get('/api/artigos/last');
    return response.data;
  }
}; 
import { api } from './api';

export const autorService = {
  // Get all authors
  getAll: async () => {
    const response = await api.get('/api/autores');
    return response.data;
  },

  // Get author by ID
  getById: async (id) => {
    const response = await api.get(`/api/autores/${id}`);
    return response.data;
  },

  // Create new author
  create: async (autorData) => {
    const response = await api.post('/api/autores', autorData);
    return response.data;
  },

  // Update author
  update: async (id, autorData) => {
    const response = await api.put(`/api/autores/${id}`, autorData);
    return response.data;
  },

  // Delete author
  delete: async (id) => {
    const response = await api.delete(`/api/autores/${id}`);
    return response.data;
  }
}; 
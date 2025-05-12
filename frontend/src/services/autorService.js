import { api } from './api';

export const autorService = {
  // Get all authors
  getAll: async () => {
    const response = await api.get('/autores');
    return response.data;
  },

  // Get author by ID
  getById: async (id) => {
    const response = await api.get(`/autores/${id}`);
    return response.data;
  },

  // Create new author
  create: async (autorData) => {
    const response = await api.post('/autores', autorData);
    return response.data;
  },

  // Update author
  update: async (id, autorData) => {
    const response = await api.put(`/autores/${id}`, autorData);
    return response.data;
  },

  // Delete author
  delete: async (id) => {
    const response = await api.delete(`/autores/${id}`);
    return response.data;
  }
}; 
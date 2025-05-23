import { api } from './api';

export const cursoService = {
  getAll: async () => {
    try {
      console.log('Fazendo requisição para /cursos');
      const response = await api.get('/cursos');
      console.log('Resposta da API:', response);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao buscar cursos:', error.response || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/cursos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar curso:', error.response || error);
      throw error;
    }
  }
}; 
import { api } from './api';

export const projectService = {
  // Get all projects
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Create new project
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Delete project
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
}; 
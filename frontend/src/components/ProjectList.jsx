// src/components/ProjectList.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const response = await api.get('/projects');
      setProjects(response.data);
    }

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Projetos Finais</h1>
      {projects.map(project => (
        <div key={project.id}>
          <h2>{project.titulo}</h2>
          <p>{project.descricao}</p>
          <p><strong>Autor:</strong> {project.autor} - <strong>Ano:</strong> {project.ano}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;

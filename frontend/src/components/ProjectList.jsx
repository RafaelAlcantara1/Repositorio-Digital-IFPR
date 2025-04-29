// src/components/ProjectList.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaFileDownload } from 'react-icons/fa'; // Você precisará instalar: npm install react-icons

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
    <div className="content-section">
      <h2 className="section-title">Informática para internet</h2>
      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <h2>{project.titulo}</h2>
            <p>{project.descricao}</p>
            <div className="project-meta">
              <p><strong>Autor:</strong> {project.autor}</p>
              <p><strong>Ano:</strong> {project.ano}</p>
            </div>
            <a href="#download" className="download-link">
              <FaFileDownload />
            </a>
          </div>
        ))}
        
        {/* Exemplos estáticos baseados na imagem de referência */}
        {projects.length === 0 && (
          <>
            <div className="project-item">
              <h2>DISPOSITIVO DE SEGURANÇA NO DESCARREGAMENTO DE CEREAIS</h2>
              <p>Trabalho desenvolvido para melhorar a segurança no processo de descarregamento de cereais.</p>
              <div className="authors">
                <p>Erika Vanessa Teixeira da Mota, Natally Sidney Ribeiro da Souza, Luiz Henrique Menezes Van Mecheln</p>
              </div>
              <a href="#download" className="download-link">
                <FaFileDownload />
              </a>
            </div>
            
            <div className="project-item">
              <h2>DESENVOLVIMENTO DE UMA PLATAFORMA WEB PARA O CONTROLE PEDAGÓGICO DA APAE DE ASSIS CHATEAUBRIAND</h2>
              <p>Plataforma web desenvolvida para auxiliar no controle pedagógico da APAE.</p>
              <div className="authors">
                <p>Ana Julia Serra de Mello, Eduarda Catisto de Oliveira, Giovana Campos Foresi, Leonardo Augusto da Silva Picciani, Alexandre Rodrigues Monge</p>
              </div>
              <a href="#download" className="download-link">
                <FaFileDownload />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
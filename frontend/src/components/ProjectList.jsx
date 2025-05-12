// src/components/ProjectList.jsx
import { useEffect, useState } from 'react';
import { artigoService } from '../services/artigoService';
import { FaFileDownload } from 'react-icons/fa';

function ProjectList() {
  const [artigos, setArtigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArtigos() {
      try {
        setLoading(true);
        const data = await artigoService.getAll();
        setArtigos(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar os artigos. Por favor, tente novamente mais tarde.');
        console.error('Erro ao carregar artigos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArtigos();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="content-section">
      <h2 className="section-title">Artigos</h2>
      <div className="project-list">
        {artigos.map(artigo => (
          <div key={artigo.id_artigo} className="project-item">
            <h2>{artigo.titulo}</h2>
            <div className="project-meta">
              <p><strong>Ano:</strong> {artigo.ano}</p>
              <p><strong>Palavras-chave:</strong> {artigo.palavra_chave}</p>
            </div>
            <div className="authors">
              {artigo.Autores && artigo.Autores.map(autor => (
                <p key={autor.id_autor}>
                  {autor.nome} ({autor.tipo})
                </p>
              ))}
            </div>
            {artigo.link && (
              <a href={artigo.link} className="download-link" target="_blank" rel="noopener noreferrer">
                <FaFileDownload /> Acessar Artigo
              </a>
            )}
          </div>
        ))}
        
        {artigos.length === 0 && (
          <div className="no-results">
            Nenhum artigo encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
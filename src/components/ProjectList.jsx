// src/components/ProjectList.jsx
import { useEffect, useState } from 'react';
import { artigoService } from '../services/artigoService';
import { FaFileDownload, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function ProjectList() {
  const [artigos, setArtigos] = useState([]);
  const [filteredArtigos, setFilteredArtigos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Log para debug do usuário
  useEffect(() => {
    console.log('Usuário atual:', user);
  }, [user]);

  // Função para destacar o texto pesquisado
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <span key={i} className="highlight">{part}</span> : 
        part
    );
  };

  const handleDelete = async (id) => {
    try {
      await artigoService.delete(id);
      setArtigos(artigos.filter(artigo => artigo.id_artigo !== id));
      setFilteredArtigos(filteredArtigos.filter(artigo => artigo.id_artigo !== id));
      setModalOpen(false);
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      alert('Erro ao deletar projeto. Por favor, tente novamente.');
    }
  };

  const openDeleteModal = (artigo) => {
    setSelectedProject(artigo);
    setModalOpen(true);
  };

  useEffect(() => {
    async function fetchArtigos() {
      try {
        setLoading(true);
        const data = await artigoService.getAll();
        console.log('Dados brutos recebidos:', data);
        console.log('Estrutura do primeiro artigo:', data[0]);
        console.log('Autores do primeiro artigo:', data[0]?.Autores);
        setArtigos(data);
        setFilteredArtigos(data);
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

  useEffect(() => {
    const filtered = artigos.filter(artigo => {
      const searchTermLower = searchTerm.toLowerCase();
      const tituloMatch = artigo.titulo.toLowerCase().includes(searchTermLower);
      const palavrasChaveMatch = artigo.palavra_chave.toLowerCase().includes(searchTermLower);
      const autoresMatch = artigo.Autores?.some(autor => 
        autor.nome.toLowerCase().includes(searchTermLower)
      );
      
      return tituloMatch || palavrasChaveMatch || autoresMatch;
    });
    
    setFilteredArtigos(filtered);
  }, [searchTerm, artigos]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="content-section">
      <h2 className="section-title">Artigos</h2>
      
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por título, palavras-chave ou autores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="project-list">
        {filteredArtigos.map(artigo => {
          console.log('Processando artigo:', artigo.id_artigo);
          console.log('Autores deste artigo:', artigo.Autores);
          return (
            <div key={artigo.id_artigo} className="project-item">
              <h2>{highlightText(artigo.titulo, searchTerm)}</h2>
              <div className="project-meta">
                <p><strong>Ano:</strong> {artigo.ano}</p>
                <p><strong>Palavras-chave:</strong> {highlightText(artigo.palavra_chave, searchTerm)}</p>
              </div>
              <div className="authors">
                {artigo.Autores && Array.isArray(artigo.Autores) && artigo.Autores.length > 0 ? (
                  <>
                    <div className="authors-section">
                      <h3>Autores:</h3>
                      <div className="author-item">
                        {artigo.Autores.map((autor, index) => (
                          <span key={autor.id_autor}>
                            {highlightText(autor.nome, searchTerm)}
                            {index < artigo.Autores.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="advisors-section">
                      <h3>Orientadores</h3>
                      {artigo.Autores.filter(autor => 
                        autor.tipo === 'Orientador' || autor.tipo === 'orientador' || autor.tipo === 'coorientador'
                      ).map(autor => (
                        <p key={autor.id_autor} className="author-item">
                          {highlightText(autor.nome, searchTerm)}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>Nenhum autor registrado</p>
                )}
              </div>
              <div className="article-actions">
                {artigo.link && (
                  <>
                    <a href={artigo.link} className="download-link" target="_blank" rel="noopener noreferrer">
                      <FaFileDownload /> Baixar Artigo
                    </a>
                    <a 
                      href={artigo.link}
                      className="view-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaEye /> Visualizar PDF
                    </a>
                  </>
                )}
                {user && (user.role === 'coordinator' || user.role === 'coordenador' || user.role === 'Coordenador') && (
                  <button
                    onClick={() => openDeleteModal(artigo)}
                    className="remove-button"
                    title="Excluir projeto"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {filteredArtigos.length === 0 && (
          <div className="no-results">
            {searchTerm ? 'Nenhum artigo encontrado para sua busca.' : 'Nenhum artigo encontrado.'}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => handleDelete(selectedProject?.id_artigo)}
        projectTitle={selectedProject?.titulo}
      />
    </div>
  );
}

export default ProjectList;
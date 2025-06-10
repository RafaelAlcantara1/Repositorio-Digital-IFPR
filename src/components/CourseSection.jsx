// src/components/CourseSection.jsx
import React, { useState, useEffect } from 'react';
import { FaFileDownload, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { cursoService } from '../services/cursoService';
import { artigoService } from '../services/artigoService';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useAuth } from '../contexts/AuthContext';

function CourseSection() {
  const [cursos, setCursos] = useState([]);
  const [artigos, setArtigos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtigo, setSelectedArtigo] = useState(null);
  const [cursoModalOpen, setCursoModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtigos, setFilteredArtigos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cursosData, artigosData] = await Promise.all([
          cursoService.getAll(),
          artigoService.getAll()
        ]);
        setCursos(cursosData);
        setArtigos(artigosData);
        setFilteredArtigos(artigosData);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Efeito para filtrar artigos quando o termo de busca mudar
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredArtigos(artigos);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = artigos.filter(artigo => {
      const tituloMatch = artigo.titulo.toLowerCase().includes(searchTermLower);
      const palavrasChaveMatch = artigo.palavra_chave?.toLowerCase().includes(searchTermLower);
      const anoMatch = artigo.ano.toString().includes(searchTermLower);
      const autoresMatch = artigo.Autores?.some(autor => 
        autor.nome.toLowerCase().includes(searchTermLower)
      );
      
      return tituloMatch || palavrasChaveMatch || anoMatch || autoresMatch;
    });
    
    setFilteredArtigos(filtered);
  }, [searchTerm, artigos]);

  const openDeleteCursoModal = (curso) => {
    if (!isAuthenticated()) {
      alert('Você precisa estar logado para excluir um curso');
      return;
    }
    setSelectedCurso(curso);
    setCursoModalOpen(true);
  };

  const handleDeleteCurso = async () => {
    try {
      await cursoService.delete(selectedCurso.id_curso);
      setCursos(cursos.filter(curso => curso.id_curso !== selectedCurso.id_curso));
      setCursoModalOpen(false);
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.error);
      } else {
        alert('Erro ao deletar curso. Por favor, tente novamente.');
      }
    }
  };

  const openDeleteModal = (artigo) => {
    if (!isAuthenticated()) {
      alert('Você precisa estar logado para excluir um artigo');
      return;
    }
    setSelectedArtigo(artigo);
    setModalOpen(true);
  };

  const handleDeleteArtigo = async () => {
    try {
      await artigoService.delete(selectedArtigo.id_artigo);
      setArtigos(artigos.filter(artigo => artigo.id_artigo !== selectedArtigo.id_artigo));
      setModalOpen(false);
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      alert('Erro ao deletar artigo. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="content-section">
      <h2 className="section-title">Cursos e Trabalhos</h2>
      
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por título, palavras-chave, autores ou ano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {cursos.map(curso => {
        const artigosDoCurso = filteredArtigos.filter(artigo => artigo.id_curso === curso.id_curso);
        
        if (artigosDoCurso.length === 0 && searchTerm) return null;
        
        return (
          <div key={curso.id_curso} id={`curso-${curso.id_curso}`} className="course-section">
            <div className="course-header">
              <h2 className="course-title">{curso.nome}</h2>
              {isAuthenticated() && (
                <button onClick={() => openDeleteCursoModal(curso)} className="delete-button">
                  <FaTrash />
                </button>
              )}
            </div>
            
            {artigosDoCurso.length > 0 ? (
              <div className="articles-list">
                {artigosDoCurso.map(artigo => (
                  <div key={artigo.id_artigo} className="article-item">
                    <div className="article-content">
                      <h3>{highlightText(artigo.titulo, searchTerm)}</h3>
                      <div className="article-meta">
                        <p><strong>Ano:</strong> {highlightText(artigo.ano.toString(), searchTerm)}</p>
                        <p><strong>Palavras-chave:</strong> {highlightText(artigo.palavra_chave, searchTerm)}</p>
                      </div>
                      <div className="authors">
                        <h4>Autores:</h4>
                        {artigo.Autores && artigo.Autores.map((autor, index) => (
                          <span key={autor.id_autor}>
                            {highlightText(autor.nome, searchTerm)}
                            {index < artigo.Autores.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="article-actions">
                      {artigo.link && (
                        <a href={artigo.link} target="_blank" rel="noopener noreferrer" className="view-link">
                          <FaEye /> Ver Trabalho
                        </a>
                      )}
                      {isAuthenticated() && (
                        <button onClick={() => openDeleteModal(artigo)} className="delete-button">
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-articles">
                {searchTerm ? 'Nenhum artigo encontrado para sua busca.' : 'Nenhum artigo cadastrado para este curso.'}
              </p>
            )}
          </div>
        );
      })}

      {searchTerm && filteredArtigos.length === 0 && (
        <div className="no-results">
          Nenhum resultado encontrado para "{searchTerm}"
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteArtigo}
        projectTitle={selectedArtigo?.titulo}
      />

      <DeleteConfirmationModal
        isOpen={cursoModalOpen}
        onClose={() => setCursoModalOpen(false)}
        onConfirm={handleDeleteCurso}
        projectTitle={selectedCurso?.nome}
        type="curso"
      />
    </div>
  );
}

export default CourseSection;
// src/components/CourseSection.jsx
import React, { useState, useEffect } from 'react';
import { FaFileDownload, FaTrash, FaEye } from 'react-icons/fa';
import { cursoService } from '../services/cursoService';
import { artigoService } from '../services/artigoService';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function CourseSection() {
  const [cursos, setCursos] = useState([]);
  const [artigos, setArtigos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtigo, setSelectedArtigo] = useState(null);

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

  const handleDeleteCurso = async (id_curso) => {
    if (window.confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      try {
        await cursoService.delete(id_curso);
        setCursos(cursos.filter(curso => curso.id_curso !== id_curso));
      } catch (error) {
        console.error('Erro ao deletar curso:', error);
        alert('Erro ao deletar curso. Por favor, tente novamente.');
      }
    }
  };

  const openDeleteModal = (artigo) => {
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
      <h2 className="section-title">Cursos e Artigos</h2>
      {cursos.map(curso => {
        const artigosDoCurso = artigos.filter(artigo => artigo.id_curso === curso.id_curso);
        
        return (
          <div key={curso.id_curso} className="course-section">
            <div className="course-header">
              <h2 className="course-title">{curso.nome}</h2>
              <button onClick={() => handleDeleteCurso(curso.id_curso)} className="delete-button">
                <FaTrash />
              </button>
            </div>
            
            {artigosDoCurso.length > 0 ? (
              <div className="articles-list">
                {artigosDoCurso.map(artigo => (
                  <div key={artigo.id_artigo} className="article-item">
                    <div className="article-content">
                      <h3>{artigo.titulo}</h3>
                      <div className="article-meta">
                        <p><strong>Ano:</strong> {artigo.ano}</p>
                        <p><strong>Palavras-chave:</strong> {artigo.palavra_chave}</p>
                      </div>
                      <div className="authors">
                        <h4>Autores:</h4>
                        {artigo.Autores && artigo.Autores.map((autor, index) => (
                          <span key={autor.id_autor}>
                            {autor.nome}
                            {index < artigo.Autores.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="article-actions">
                      {artigo.link && (
                        <a href={artigo.link} target="_blank" rel="noopener noreferrer" className="view-link">
                          <FaEye /> Ver
                        </a>
                      )}
                      <button onClick={() => openDeleteModal(artigo)} className="delete-button">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-articles">Nenhum artigo cadastrado para este curso.</p>
            )}
          </div>
        );
      })}

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteArtigo}
        projectTitle={selectedArtigo?.titulo}
      />
    </div>
  );
}

export default CourseSection;
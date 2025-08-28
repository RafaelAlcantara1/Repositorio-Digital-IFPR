// src/components/CourseSection.jsx
import React, { useState, useEffect } from 'react';
import { FaFileDownload, FaTrash, FaEye, FaSearch, FaChevronDown, FaChevronUp, FaPencilAlt } from 'react-icons/fa';
import { cursoService } from '../services/cursoService';
import { artigoService } from '../services/artigoService';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ArtigoEditModal from './ArtigoEditModal';
import { useAuth } from '../contexts/AuthContext';
import styles from './CourseSection.module.css';

function CourseSection() {
  const [cursos, setCursos] = useState([]);
  const [artigos, setArtigos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtigo, setSelectedArtigo] = useState(null);
  const [cursoModalOpen, setCursoModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [artigoToEdit, setArtigoToEdit] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtigos, setFilteredArtigos] = useState([]);
  const [expandedTypes, setExpandedTypes] = useState({
    TECNICO_INTEGRADO: false,
    TECNICO_SUBSEQUENTE: false,
    SUPERIOR: false
  });
  
  // Estados para pesquisa avançada
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedTipoCurso, setSelectedTipoCurso] = useState('');
  const [selectedAno, setSelectedAno] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cursosData, artigosData] = await Promise.all([
          cursoService.getAll(),
          artigoService.getAll()
        ]);
        console.log('Cursos carregados:', cursosData);
        console.log('Artigos carregados:', artigosData);
        console.log('Estrutura do primeiro artigo:', artigosData[0]);
        setCursos(cursosData);
        setArtigos(artigosData);
        setFilteredArtigos(artigosData);
        setError(null);
      } catch (error) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para normalizar texto (remover acentos e converter para minúsculo)
  const normalizeText = (text) => {
    if (!text) return '';
    return text.toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Função para destacar o texto pesquisado
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const normalizedText = normalizeText(text);
    const normalizedSearchTerm = normalizeText(searchTerm);
    
    if (!normalizedText.includes(normalizedSearchTerm)) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      normalizeText(part) === normalizedSearchTerm ? 
                                <span key={i} className={styles.highlight}>{part}</span> : 
        part
    );
  };

  // Efeito para filtrar artigos quando qualquer filtro mudar
  useEffect(() => {
    let filtered = [...artigos];

    // Filtro por texto (busca atual)
    if (searchTerm.trim()) {
      const normalizedSearchTerm = normalizeText(searchTerm);
      
      filtered = filtered.filter(artigo => {
        const tituloMatch = normalizeText(artigo.titulo).includes(normalizedSearchTerm);
        const palavrasChaveMatch = normalizeText(artigo.palavra_chave).includes(normalizedSearchTerm);
        const anoMatch = normalizeText(artigo.ano).includes(normalizedSearchTerm);
        const autoresMatch = artigo.autores?.some(autor => 
          normalizeText(autor.nome).includes(normalizedSearchTerm)
        );
        
        // Busca por nome do curso
        let cursoMatch = false;
        if (artigo.id_curso) {
          if (typeof artigo.id_curso === 'object' && artigo.id_curso.nome) {
            cursoMatch = normalizeText(artigo.id_curso.nome).includes(normalizedSearchTerm);
          } else {
            // Se não tiver o nome do curso populado, buscar pelo ID
            const curso = cursos.find(c => c._id === artigo.id_curso);
            if (curso) {
              cursoMatch = normalizeText(curso.nome).includes(normalizedSearchTerm);
            }
          }
        }
        
        return tituloMatch || palavrasChaveMatch || anoMatch || autoresMatch || cursoMatch;
      });
    }

    // Filtro por tipo de curso
    if (selectedTipoCurso) {
      filtered = filtered.filter(artigo => {
        if (artigo.id_curso) {
          let cursoId;
          if (typeof artigo.id_curso === 'object') {
            cursoId = artigo.id_curso._id;
          } else {
            cursoId = artigo.id_curso;
          }
          const curso = cursos.find(c => c._id === cursoId);
          return curso && curso.tipo_curso === selectedTipoCurso;
        }
        return false;
      });
    }

    // Filtro por ano
    if (selectedAno) {
      filtered = filtered.filter(artigo => artigo.ano.toString() === selectedAno);
    }
    
    setFilteredArtigos(filtered);
  }, [searchTerm, selectedTipoCurso, selectedAno, artigos, cursos]);

  const toggleTypeExpansion = (tipo) => {
    setExpandedTypes(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }));
  };

  const scrollToCourse = (cursoId) => {
    const element = document.getElementById(`curso-${cursoId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearAdvancedFilters = () => {
    setSelectedTipoCurso('');
    setSelectedAno('');
  };

  const openDeleteCursoModal = (curso) => {
    if (!isAuthenticated() || user?.role !== 'admin') {
      alert('Você precisa ser administrador para excluir um curso');
      return;
    }
    setSelectedCurso(curso);
    setCursoModalOpen(true);
  };

  const handleDeleteCurso = async () => {
    try {
      await cursoService.delete(selectedCurso._id);
      setCursos(cursos.filter(curso => curso._id !== selectedCurso._id));
      setCursoModalOpen(false);
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.error);
      } else {
        alert('Erro ao deletar curso. Por favor, tente novamente.');
      }
    }
  };

  const openDeleteModal = (artigo) => {
    if (!isAuthenticated() || user?.role !== 'admin') {
      alert('Você precisa ser administrador para excluir um artigo');
      return;
    }
    console.log('Abrindo modal de exclusão para artigo:', artigo);
    console.log('ID do artigo:', artigo._id);
    setSelectedArtigo(artigo);
    setModalOpen(true);
  };

  const openEditModal = (artigo) => {
    if (!isAuthenticated() || user?.role !== 'admin') {
      alert('Você precisa ser administrador para editar um artigo');
      return;
    }
    setArtigoToEdit(artigo);
    setEditModalOpen(true);
  };

  const handleDeleteArtigo = async () => {
    try {
      console.log('Tentando deletar artigo:', selectedArtigo);
      console.log('ID do artigo:', selectedArtigo._id);
      console.log('Tipo do ID:', typeof selectedArtigo._id);
      
      if (!selectedArtigo._id) {
        alert('Erro: ID do artigo não encontrado');
        return;
      }
      
      await artigoService.delete(selectedArtigo._id);
      setArtigos(artigos.filter(artigo => artigo._id !== selectedArtigo._id));
      setModalOpen(false);
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      alert('Erro ao deletar artigo. Por favor, tente novamente.');
    }
  };

  // Função para agrupar cursos por tipo
  const cursosPorTipo = cursos.reduce((acc, curso) => {
    const tipo = curso.tipo_curso;
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(curso);
    return acc;
  }, {});

  // Função para renderizar os cursos de um tipo específico
  const renderCursosPorTipo = (tipo, cursosDoTipo) => {
    // Filtrar cursos do tipo que correspondem aos filtros avançados
    let cursosFiltrados = [...cursosDoTipo];
    
    // Aplicar filtros avançados aos cursos
    if (selectedTipoCurso && tipo !== selectedTipoCurso) {
      return null; // Não mostrar seções de tipos diferentes do selecionado
    }
    
    const artigosDoTipo = filteredArtigos.filter(artigo => {
      const match = cursosFiltrados.some(curso => {
        // Verificar se id_curso é um objeto (populado) ou string (ID)
        const artigoCursoId = typeof artigo.id_curso === 'object' ? artigo.id_curso._id : artigo.id_curso;
        return curso._id === artigoCursoId;
      });
      return match;
    });

    // Se há termo de pesquisa, verificar se algum curso do tipo corresponde
    if (searchTerm) {
      const normalizedSearchTerm = normalizeText(searchTerm);
      const cursoMatch = cursosFiltrados.some(curso => 
        normalizeText(curso.nome).includes(normalizedSearchTerm)
      );
      
      // Se não há artigos nem correspondência de curso, não mostrar a seção
      if (artigosDoTipo.length === 0 && !cursoMatch) return null;
    }
    
    // Se não há artigos e há filtros ativos, não mostrar a seção
    if (artigosDoTipo.length === 0 && (selectedTipoCurso || selectedAno)) {
      return null;
    }

    const tipoTitle = {
      'TECNICO_INTEGRADO': 'Cursos Técnicos Integrados ao Ensino Médio',
      'TECNICO_SUBSEQUENTE': 'Cursos Técnicos Subsequentes',
      'SUPERIOR': 'Cursos Superiores'
    }[tipo];

    const tipoId = {
      'TECNICO_INTEGRADO': 'cursos-tecnicos-integrados',
      'TECNICO_SUBSEQUENTE': 'cursos-tecnicos-subsequentes',
      'SUPERIOR': 'cursos-superiores'
    }[tipo];

    return (
      <div className={styles.courseTypeSection} id={tipoId}>
        <div 
          className={styles.courseTypeHeader}
          onClick={() => toggleTypeExpansion(tipo)}
        >
          <h2 className={styles.courseTypeTitle}>{tipoTitle}</h2>
          <div className={styles.dropdownIcon}>
            {expandedTypes[tipo] ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>

        {expandedTypes[tipo] && (
          <div className={styles.courseTypeDropdown}>
            {cursosDoTipo.map(curso => (
              <div 
                key={curso._id} 
                className={styles.courseDropdownItem}
                onClick={() => scrollToCourse(curso._id)}
              >
                {curso.nome}
              </div>
            ))}
          </div>
        )}
        
        {cursosFiltrados.map(curso => {
          const artigosDoCurso = artigosDoTipo.filter(artigo => {
            const artigoCursoId = typeof artigo.id_curso === 'object' ? artigo.id_curso._id : artigo.id_curso;
            return artigoCursoId === curso._id;
          });
          
          // Se há termo de pesquisa, verificar se o curso corresponde
          if (searchTerm) {
            const normalizedSearchTerm = normalizeText(searchTerm);
            const cursoMatch = normalizeText(curso.nome).includes(normalizedSearchTerm);
            
            // Se não há artigos nem correspondência de curso, não mostrar
            if (artigosDoCurso.length === 0 && !cursoMatch) return null;
          }
          
          // Se há filtros ativos e não há artigos, não mostrar o curso
          if ((selectedTipoCurso || selectedAno) && artigosDoCurso.length === 0) {
            return null;
          }
          
                      return (
              <div key={curso._id} id={`curso-${curso._id}`} className={styles['course-section']}>
              <div className="course-header">
                <h3 className="course-title">{curso.nome}</h3>
                {isAuthenticated() && user?.role === 'admin' && (
                  <button onClick={() => openDeleteCursoModal(curso)} className="delete-button">
                    <FaTrash />
                  </button>
                )}
              </div>
              
              {artigosDoCurso.length > 0 ? (
                <div className="articles-list">
                  {artigosDoCurso.map(artigo => (
                    <div key={artigo._id} className="article-item">
                      <div className="article-content">
                        <h3>{highlightText(artigo.titulo, searchTerm)}</h3>
                        <div className="article-meta">
                          <p><strong>Ano:</strong> {highlightText(artigo.ano.toString(), searchTerm)}</p>
                          <p><strong>Palavras-chave:</strong> {highlightText(artigo.palavra_chave, searchTerm)}</p>
                        </div>
                        <div className="authors">
                          <h5>Autores:</h5>
                          {artigo.autores && artigo.autores.map((autor, index) => (
                            <span key={autor._id}>
                              {highlightText(autor.nome, searchTerm)}
                              {index < artigo.autores.length - 1 ? ', ' : ''}
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
                        {isAuthenticated() && user?.role === 'admin' && (
                          <>
                                      <button onClick={() => openEditModal(artigo)} className={styles['edit-button']}>
                              <FaPencilAlt />
                            </button>
                            <button onClick={() => openDeleteModal(artigo)} className={styles['delete-button']}>
                              <FaTrash />
                            </button>
                          </>
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
      </div>
    );
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
            placeholder="Buscar por título, palavras-chave, autores, ano ou nome do curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        {/* Botão para mostrar/ocultar pesquisa avançada */}
        <button 
          className="advanced-search-toggle"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          {showAdvancedSearch ? 'Ocultar' : 'Pesquisa Avançada'} 
          <FaChevronDown className={showAdvancedSearch ? 'rotate' : ''} />
        </button>
        
        {/* Pesquisa avançada */}
        {showAdvancedSearch && (
          <div className="advanced-search-filters">
            <div className="filter-group">
              <label htmlFor="tipo-curso">Tipo de Curso:</label>
              <select
                id="tipo-curso"
                value={selectedTipoCurso}
                onChange={(e) => setSelectedTipoCurso(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="TECNICO_INTEGRADO">Técnico Integrado ao Ensino Médio</option>
                <option value="TECNICO_SUBSEQUENTE">Técnico Subsequente</option>
                <option value="SUPERIOR">Superior</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="ano">Ano de Conclusão:</label>
              <select
                id="ano"
                value={selectedAno}
                onChange={(e) => setSelectedAno(e.target.value)}
              >
                <option value="">Todos os anos</option>
                {Array.from(new Set(artigos.map(artigo => artigo.ano)))
                  .sort((a, b) => b - a) // Ordenar anos decrescente
                  .map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))
              }
              </select>
            </div>
            
            <button 
              className="clear-filters-btn"
              onClick={clearAdvancedFilters}
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {Object.entries(cursosPorTipo).map(([tipo, cursosDoTipo]) => 
        renderCursosPorTipo(tipo, cursosDoTipo)
      )}

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

      <ArtigoEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        artigo={artigoToEdit}
      />
    </div>
  );
}

export default CourseSection;
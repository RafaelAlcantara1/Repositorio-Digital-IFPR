import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaDownload, FaShare, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { artigoService } from '../services/artigoService';
import styles from './ArtigoModal.module.css';

const ArtigoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [artigo, setArtigo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousArtigo, setPreviousArtigo] = useState(null);
  const [nextArtigo, setNextArtigo] = useState(null);

  useEffect(() => {
    const fetchArtigo = async () => {
      try {
        setLoading(true);
        const artigoData = await artigoService.getById(id);
        setArtigo(artigoData);
        
        // Buscar artigos anterior e próximo
        await fetchAdjacentArtigos(artigoData);
        
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar artigo:', error);
        setError('Artigo não encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchArtigo();
  }, [id]);

  const fetchAdjacentArtigos = async (currentArtigo) => {
    try {
      // Buscar todos os artigos para encontrar anterior e próximo
      const allArtigos = await artigoService.getAll();
      
      // Ordenar artigos por algum critério (ex: data de criação ou título)
      const sortedArtigos = allArtigos.sort((a, b) => {
        // Ordenar por título alfabeticamente
        return a.titulo.localeCompare(b.titulo);
      });
      
      const currentIndex = sortedArtigos.findIndex(a => a._id === currentArtigo._id);
      
      if (currentIndex > 0) {
        setPreviousArtigo(sortedArtigos[currentIndex - 1]);
      }
      
      if (currentIndex < sortedArtigos.length - 1) {
        setNextArtigo(sortedArtigos[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Erro ao buscar artigos adjacentes:', error);
    }
  };

  const handleShare = () => {
    const articleUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: artigo.titulo,
        text: `Confira este trabalho: ${artigo.titulo}`,
        url: articleUrl
      });
    } else {
      navigator.clipboard.writeText(articleUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  const navigateToPrevious = () => {
    if (previousArtigo) {
      navigate(`/artigo/${previousArtigo._id}`);
    }
  };

  const navigateToNext = () => {
    if (nextArtigo) {
      navigate(`/artigo/${nextArtigo._id}`);
    }
  };

  const goBack = () => {
    // Se veio de uma página específica, voltar para ela
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      // Senão, voltar para a home
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingText}>Carregando artigo...</div>
        </div>
      </div>
    );
  }

  if (error || !artigo) {
    return (
      <div className={styles.errorContainer}>
        <h2>Artigo não encontrado</h2>
        <p>O artigo que você está procurando não existe ou foi removido.</p>
        <button onClick={goBack} className={styles.backButton}>
          <FaArrowLeft />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>{artigo.titulo}</h1>
        </div>
      </div>

      <div className={styles.pageActions}>
        <div className={styles.pageActionsContent}>
          <button 
            className={styles.backButton} 
            onClick={goBack}
            aria-label="Voltar"
          >
            <FaArrowLeft />
            Voltar
          </button>
          
          <button 
            className={styles.shareButton} 
            onClick={handleShare}
            aria-label="Compartilhar"
          >
            <FaShare />
            Compartilhar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.pageContent}>
        <div className={styles.contentCard}>
          <div className={styles.articleInfo}>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <strong>Ano:</strong> {artigo.ano}
              </div>
              {artigo.id_curso && (
                <div className={styles.metaItem}>
                  <strong>Curso:</strong> {typeof artigo.id_curso === 'object' ? artigo.id_curso.nome : artigo.id_curso}
                </div>
              )}
              {artigo.palavra_chave && (
                <div className={styles.metaItem}>
                  <strong>Palavras-chave:</strong> {artigo.palavra_chave}
                </div>
              )}
            </div>

            {artigo.autores && artigo.autores.length > 0 && (
              <div className={styles.authorsSection}>
                <h3>Autores</h3>
                <div className={styles.authorsList}>
                  {artigo.autores.map((autor, index) => (
                    <div key={autor._id || index} className={styles.authorItem}>
                      <span className={styles.authorName}>{autor.nome}</span>
                      <span className={styles.authorType}>({autor.tipo})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actionsSection}>
            {artigo.link && (
              <a 
                href={artigo.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                <FaEye />
                Ver Trabalho Completo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      {(previousArtigo || nextArtigo) && (
        <div className={styles.pageFooter}>
          <div className={styles.footerCard}>
            <div className={styles.navigationButtons}>
              {previousArtigo && (
                <button 
                  className={styles.navButtonLarge} 
                  onClick={navigateToPrevious}
                >
                  <FaChevronLeft />
                  Artigo Anterior
                </button>
              )}
              
              {nextArtigo && (
                <button 
                  className={styles.navButtonLarge} 
                  onClick={navigateToNext}
                >
                  Próximo Artigo
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtigoPage;

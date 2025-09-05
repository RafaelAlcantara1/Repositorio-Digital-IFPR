import React from 'react';
import { FaTimes, FaEye, FaDownload, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './ArtigoModal.module.css';

const ArtigoModal = ({ isOpen, onClose, artigo, onPrevious, onNext, hasPrevious, hasNext }) => {

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && hasPrevious) {
      onPrevious();
    } else if (e.key === 'ArrowRight' && hasNext) {
      onNext();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasPrevious, hasNext]);

  if (!isOpen || !artigo) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            {hasPrevious && (
              <button 
                className={styles.navButton} 
                onClick={onPrevious}
                aria-label="Artigo anterior"
              >
                <FaChevronLeft />
              </button>
            )}
            <h2 className={styles.modalTitle}>{artigo.titulo}</h2>
          </div>
          
          <div className={styles.headerRight}>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label="Fechar modal"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
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
            
            <button className={styles.actionButton} onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: artigo.titulo,
                  text: `Confira este trabalho: ${artigo.titulo}`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado para a área de transferência!');
              }
            }}>
              <FaShare />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Navigation Footer */}
        {(hasPrevious || hasNext) && (
          <div className={styles.modalFooter}>
            <div className={styles.navigationButtons}>
              {hasPrevious && (
                <button 
                  className={styles.navButtonLarge} 
                  onClick={onPrevious}
                >
                  <FaChevronLeft />
                  Artigo Anterior
                </button>
              )}
              
              {hasNext && (
                <button 
                  className={styles.navButtonLarge} 
                  onClick={onNext}
                >
                  Próximo Artigo
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtigoModal;


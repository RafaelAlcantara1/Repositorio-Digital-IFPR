import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, projectTitle, type = 'artigo' }) => {
  if (!isOpen) return null;

  const getTitle = () => {
    return type === 'curso' ? 'Excluir Curso' : 'Excluir Artigo';
  };

  const getMessage = () => {
    return type === 'curso'
      ? `Tem certeza que deseja excluir o curso "${projectTitle}"? Esta ação não pode ser desfeita.`
      : `Tem certeza que deseja excluir o artigo "${projectTitle}"? Esta ação não pode ser desfeita.`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{getTitle()}</h2>
        <p>{getMessage()}</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 
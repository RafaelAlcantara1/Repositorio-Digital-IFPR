import React from 'react';
import './DeleteConfirmationModal.css';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, projectTitle }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir o projeto "{projectTitle}"?</p>
        <p className="warning-text">Esta ação não pode ser desfeita.</p>
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal; 
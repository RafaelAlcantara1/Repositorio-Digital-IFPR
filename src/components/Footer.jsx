import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Repositório Digital IFPR</h3>
          <p>Instituto Federal do Paraná</p>
          <p>Campus Assis Chateaubriand</p>
        </div>
        
        <div className="footer-section">
          <h3>Contato</h3>
          <p>Email: contato@ifpr.edu.br</p>
          <p>Telefone: (44) 3422-5666</p>
        </div>
        
        <div className="footer-section">
          <h3>Links Úteis</h3>
          <ul>
            <li><a href="https://www.ifpr.edu.br" target="_blank" rel="noopener noreferrer">IFPR</a></li>
            <li><a href="https://ifpr.edu.br/assis-chateaubriand/" target="_blank" rel="noopener noreferrer">Campus Assis Chateaubriand</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Repositório Digital IFPR. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer; 
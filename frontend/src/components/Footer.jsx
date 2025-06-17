import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        
        <div className="footer-section">
          <h3>Repositório Digital IFPR</h3>
          <ul>
            <li><a href="https://www.ifpr.edu.br" target="_blank" rel="noopener noreferrer">Instituto Federal do Paraná</a></li>
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
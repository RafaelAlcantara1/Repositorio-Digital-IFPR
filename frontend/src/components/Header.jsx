// src/components/Header.jsx
import React from 'react';
import logoIFPR from '../assets/logo-ifpr.png'; // Você precisará adicionar este arquivo
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoIFPR} alt="Logo IFPR" />
      </div>
      <div className="title">
        <h1>Repositório Digital IFPR</h1>
        <span>Projetos Finais de Curso - Campus Assis Chateaubriand</span>
      </div>
    </header>
  );
}

export default Header;
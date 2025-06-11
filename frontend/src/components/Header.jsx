// src/components/Header.jsx
import React from 'react';
import logoIFPR from '../assets/logo-ifpr.png'; // Você precisará adicionar este arquivo

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoIFPR} alt="Logo IFPR" />
      </div>
      <div className="title">
        Sistema de Repositório Digital para os Projetos Finais de Curso do IFPR Campus Assis Chateaubriand
      </div>
    </header>
  );
}

export default Header;
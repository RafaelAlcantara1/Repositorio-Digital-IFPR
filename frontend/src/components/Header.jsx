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
        Repositório Digital - IFPR
      </div>
    </header>
  );
}

export default Header;
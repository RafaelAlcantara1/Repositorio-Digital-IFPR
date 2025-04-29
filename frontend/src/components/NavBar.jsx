// src/components/NavBar.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Você precisará instalar: npm install react-icons

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
        <a href="#cursos">Cursos</a>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Buscar" />
        <button>
          <FaSearch />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
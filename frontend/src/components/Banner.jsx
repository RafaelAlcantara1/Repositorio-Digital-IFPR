// src/components/Banner.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import bookImage from '../assets/livro.png'; // Você precisará adicionar este arquivo

function Banner() {
  return (
    <div className="banner">
      <Link to="/sobre">
        <img src={bookImage} alt="Livro aberto representando o repositório digital IFPR" />
      </Link>
    </div>
  );
}

export default Banner;
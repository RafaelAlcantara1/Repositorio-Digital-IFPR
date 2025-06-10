// src/components/Banner.jsx
import React from 'react';
import bookImage from '../assets/livro.jpg'; // Você precisará adicionar este arquivo

function Banner() {
  return (
    <div className="banner">
      <img src={bookImage} alt="Livro aberto" />
    </div>
  );
}

export default Banner;
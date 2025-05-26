import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Início</Link>
        {isAuthenticated() ? (
          <>
            <Link to="/admin">Painel de Controle</Link>
            <span className="user-info">
              Olá, {user?.username}
            </span>
          </>
        ) : (
          <Link to="/login">Área do Coordenador</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 
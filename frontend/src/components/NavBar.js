import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaChevronDown, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCourseCategoryClick = (category) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
    }

    setTimeout(() => {
      const element = document.getElementById(category);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Início</Link>
        <Link to="/sobre" onClick={() => setIsMobileMenuOpen(false)}>Sobre</Link>
        <div className="dropdown" ref={dropdownRef}>
          <button 
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Cursos <FaChevronDown className={`dropdown-icon ${isDropdownOpen ? 'rotate' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <button
                onClick={() => handleCourseCategoryClick('cursos-tecnicos-integrados')}
                className="dropdown-item"
              >
                Cursos Técnicos Integrados ao Ensino Médio
              </button>
              <button
                onClick={() => handleCourseCategoryClick('cursos-superiores')}
                className="dropdown-item"
              >
                Cursos Superiores
              </button>
              <button
                onClick={() => handleCourseCategoryClick('cursos-tecnicos-subsequentes')}
                className="dropdown-item"
              >
                Cursos Técnicos Subsequentes
              </button>
            </div>
          )}
        </div>
        {isAuthenticated && user ? (
          <>
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Painel de Controle</Link>
            <div className="user-info">
              <span className="welcome-text">Olá, Coordenador(a)!</span>
              <button 
                className="nav-button" 
                onClick={handleLogout}
                style={{ marginLeft: '10px' }}
              >
                <FaSignOutAlt /> Sair
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Área da Coordenação</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 
// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { cursoService } from '../services/cursoService';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [cursos, setCursos] = useState([]);
  const dropdownRef = useRef(null);
  const coursesDropdownRef = useRef(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await cursoService.getAll();
        setCursos(data);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (coursesDropdownRef.current && !coursesDropdownRef.current.contains(event.target)) {
        setIsCoursesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToCourse = (cursoId) => {
    const courseElement = document.getElementById(`curso-${cursoId}`);
    if (courseElement) {
      courseElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsCoursesDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Repositório Digital</Link>
      </div>
      
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className="navbar-item">Início</Link>
          <div className="navbar-item has-dropdown" ref={coursesDropdownRef}>
            <button 
              className="navbar-link"
              onClick={() => setIsCoursesDropdownOpen(!isCoursesDropdownOpen)}
            >
              Cursos <FaChevronDown className={isCoursesDropdownOpen ? 'rotate' : ''} />
            </button>
            {isCoursesDropdownOpen && (
              <div className="navbar-dropdown">
                {cursos.map(curso => (
                  <button
                    key={curso.id_curso}
                    className="dropdown-item"
                    onClick={() => scrollToCourse(curso.id_curso)}
                  >
                    {curso.nome}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/sobre" className="navbar-item">Sobre</Link>
        </div>

        <div className="navbar-end">
          {isAuthenticated() ? (
            <div className="navbar-item has-dropdown" ref={dropdownRef}>
              <button 
                className="navbar-link"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaUser /> {user?.nome}
              </button>
              {isDropdownOpen && (
                <div className="navbar-dropdown">
                  <Link to="/painel" className="dropdown-item">
                    <FaCog /> Painel de Controle
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <FaSignOutAlt /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-item">
              <FaUser /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
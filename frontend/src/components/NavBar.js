import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cursoService } from '../services/cursoService';
import { FaChevronDown } from 'react-icons/fa';

const NavBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCourseClick = (cursoId) => {
    navigate('/');
    const courseElement = document.getElementById(`curso-${cursoId}`);
    if (courseElement) {
      courseElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Início</Link>
        <div className="dropdown" ref={dropdownRef}>
          <button 
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Cursos <FaChevronDown className={`dropdown-icon ${isDropdownOpen ? 'rotate' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              {cursos.map(curso => (
                <button
                  key={curso.id_curso}
                  onClick={() => handleCourseClick(curso.id_curso)}
                  className="dropdown-item"
                >
                  {curso.nome}
                </button>
              ))}
            </div>
          )}
        </div>
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
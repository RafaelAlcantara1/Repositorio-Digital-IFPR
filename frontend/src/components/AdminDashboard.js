import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { getCursos } from '../services/cursos';
import { getArtigos } from '../services/artigos';
import { logout } from '../services/auth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [cursos, setCursos] = useState([]);
  const [artigos, setArtigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosData, artigosData] = await Promise.all([
          getCursos(),
          getArtigos()
        ]);
        setCursos(cursosData);
        setArtigos(artigosData);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Painel de Controle</h1>
        <Link to="/admin/novo-curso" className="add-button">
          <FaPlus /> Novo Curso
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Cursos</h2>
          <div className="course-list">
            {cursos.map(curso => (
              <div key={curso.id_curso} className="course-card">
                <h3>{curso.nome}</h3>
                <p>{curso.descricao}</p>
                <div className="course-actions">
                  <Link to={`/admin/curso/${curso.id_curso}`} className="edit-button">
                    Gerenciar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Artigos Recentes</h2>
          <div className="article-list">
            {artigos.slice(0, 5).map(artigo => (
              <div key={artigo.id_artigo} className="article-card">
                <h3>{artigo.titulo}</h3>
                <p className="article-meta">
                  Curso: {artigo.curso_nome} | Data: {new Date(artigo.data_submissao).toLocaleDateString()}
                </p>
                <div className="article-actions">
                  <Link to={`/admin/artigo/${artigo.id_artigo}`} className="edit-button">
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
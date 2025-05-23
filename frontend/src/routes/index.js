import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../components/Login';
import Banner from '../components/Banner';
import CourseSection from '../components/CourseSection';
import ProtectedRoute from '../components/ProtectedRoute';
import ArtigoForm from '../components/ArtigoForm';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Admin.css';

// Componente para a página inicial
const Home = () => (
  <>
    <Banner />
    <CourseSection />
  </>
);

// Componente para a área administrativa
const AdminArea = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-area">
      <div className="admin-header">
        <h1>Área do Coordenador</h1>
        <button 
          onClick={logout}
          className="admin-logout-button"
        >
          Sair do Sistema
        </button>
      </div>
      <div className="admin-content">
        <ArtigoForm />
      </div>
    </div>
  );
};

// Configuração das rotas
const routes = [
  {
    path: '/',
    element: <Layout><Home /></Layout>
  },
  {
    path: '/login',
    element: <Layout><Login /></Layout>
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Layout>
          <AdminArea />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes; 
import React, { createContext, useState, useContext, useEffect } from 'react';
import AUTH_CONFIG from '../config/auth';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const lastLogin = localStorage.getItem('lastLogin');

    if (storedUser && storedToken && lastLogin) {
      // Verificar se a sessão expirou
      const now = new Date().getTime();
      const loginTime = new Date(lastLogin).getTime();
      
      if (now - loginTime < AUTH_CONFIG.sessionTimeout) {
        setUser(JSON.parse(storedUser));
      } else {
        // Sessão expirada, limpar dados
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('lastLogin');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Tentando login com:', { username, password });
      
      // Fazer requisição para a API de autenticação usando a instância api configurada
      const response = await api.post('/auth/login', {
        username,
        password
      });

      const data = response.data;
      console.log('Resposta do servidor:', data);

      if (data.success) {
        const userData = {
          username: data.data.user.username,
          role: data.data.user.role,
          lastLogin: new Date().toISOString()
        };
        
        // Salvar dados do usuário e token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, error: data.message || 'Credenciais inválidas' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
    setUser(null);
  };

  const isAuthenticated = () => {
    if (!user) return false;

    // Verificar se a sessão expirou
    const lastLogin = localStorage.getItem('lastLogin');
    if (!lastLogin) return false;

    const now = new Date().getTime();
    const loginTime = new Date(lastLogin).getTime();
    
    if (now - loginTime >= AUTH_CONFIG.sessionTimeout) {
      logout();
      return false;
    }

    return true;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 
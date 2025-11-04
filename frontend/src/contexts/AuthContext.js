import React, { createContext, useState, useContext, useEffect } from 'react';
import AUTH_CONFIG from '../config/auth';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const lastLogin = localStorage.getItem('lastLogin');

    if (storedUser && storedToken && lastLogin) {
      const now = new Date().getTime();
      const loginTime = new Date(lastLogin).getTime();
      
      if (now - loginTime < AUTH_CONFIG.sessionTimeout) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('lastLogin');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Autentica o usuário e salva token no localStorage
   */
  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });

      const data = response.data;

      if (data.success) {
        const userData = {
          username: data.data.user.username,
          role: data.data.user.role,
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, error: data.message || 'Credenciais inválidas' };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
    setUser(null);
  };

  /**
   * Verifica se o usuário está autenticado e se a sessão não expirou
   */
  const isAuthenticated = () => {
    if (!user) return false;

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
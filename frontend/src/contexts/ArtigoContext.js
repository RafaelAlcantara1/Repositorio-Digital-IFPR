import React, { createContext, useContext, useState, useEffect } from 'react';
import { artigoService } from '../services/artigoService';

const ArtigoContext = createContext();

export const useArtigos = () => {
  const context = useContext(ArtigoContext);
  if (!context) {
    throw new Error('useArtigos deve ser usado dentro de um ArtigoProvider');
  }
  return context;
};

export const ArtigoProvider = ({ children }) => {
  const [totalArtigos, setTotalArtigos] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalArtigos = async () => {
    try {
      setLoading(true);
      // Buscar todos os artigos para contar
      const response = await artigoService.getAll(1, 1000); // Buscar muitos artigos para contar
      const artigos = response.artigos || response;
      setTotalArtigos(artigos.length);
    } catch (error) {
      console.error('Erro ao buscar total de artigos:', error);
      setTotalArtigos(0);
    } finally {
      setLoading(false);
    }
  };

  const updateTotalArtigos = (increment = 1) => {
    setTotalArtigos(prev => prev + increment);
  };

  const decrementTotalArtigos = (decrement = 1) => {
    setTotalArtigos(prev => Math.max(0, prev - decrement));
  };

  useEffect(() => {
    fetchTotalArtigos();
  }, []);

  const value = {
    totalArtigos,
    loading,
    fetchTotalArtigos,
    updateTotalArtigos,
    decrementTotalArtigos
  };

  return (
    <ArtigoContext.Provider value={value}>
      {children}
    </ArtigoContext.Provider>
  );
};

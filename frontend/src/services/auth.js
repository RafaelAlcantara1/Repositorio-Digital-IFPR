// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Função para obter os dados do usuário
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Função para salvar os dados do usuário após login
export const setUser = (userData, token) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);
};

// Função para fazer logout
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}; 
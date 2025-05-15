// Configuração de autenticação
const AUTH_CONFIG = {
  // Em produção, estas credenciais devem vir de variáveis de ambiente
  // ou de um arquivo .env que não seja versionado
  credentials: {
    username: process.env.REACT_APP_ADMIN_USERNAME,
    password: process.env.REACT_APP_ADMIN_PASSWORD
  },
  // Tempo de expiração da sessão em milissegundos (24 horas)
  sessionTimeout: 24 * 60 * 60 * 1000
};

export default AUTH_CONFIG; 
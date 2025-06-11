const { Sequelize } = require('sequelize');
require('dotenv').config();

// Log das variáveis de ambiente (sem mostrar a senha)
console.log('Configuração do banco de dados:');
console.log('DB_NAME:', process.env.DB_NAME || 'defaultdb');
console.log('DB_USER:', process.env.DB_USER || 'avnadmin');
console.log('DB_HOST:', process.env.DB_HOST || 'repositorioteste-repositorioteste.d.aivencloud.com');
console.log('DB_PORT:', process.env.DB_PORT || 24492);

const sequelize = new Sequelize(
  process.env.DB_NAME || "defaultdb",
  process.env.DB_USER || "avnadmin",
  process.env.DB_PASSWORD || "AVNS_TaG_V3h7TAOOQvnAyDN",
  {
    host: process.env.DB_HOST || "repositorioteste-repositorioteste.d.aivencloud.com",
    dialect: "mysql",
    port: process.env.DB_PORT || 24492,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log, // Adiciona logs das queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Teste de conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

module.exports = sequelize;

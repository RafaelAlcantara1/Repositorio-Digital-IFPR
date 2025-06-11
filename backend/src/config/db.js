const { Sequelize } = require('sequelize');
require('dotenv').config();

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
    }
  }
);

module.exports = sequelize;

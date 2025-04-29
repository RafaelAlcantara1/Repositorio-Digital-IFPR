const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  "repositorioteste",
  "avnadmin",
  "AVNS_TaG_V3h7TAOOQvnAyDN", {
    host: "repositorioteste-repositorioteste.d.aivencloud.com",
    dialect: 'mysql', 
  }
);

module.exports = sequelize;

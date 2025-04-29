const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  "repositorioteste",
  "root",
  "", {
    host: "localhost",
    dialect: 'mysql', 
  }
);

module.exports = sequelize;

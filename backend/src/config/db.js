const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  "repositorio_projetos", 
  "root", 
  "",{
    host: "localhost",
    dialect: "mysql"
  }
)

module.exports = sequelize;

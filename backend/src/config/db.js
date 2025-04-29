const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('repositorioteste', 'avnadmin', 'AVNS_TaG_V3h7TAOOQvnAyDN', {
  host: 'repositorioteste-repositorioteste.d.aivencloud.com',
  port: 24492,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, './ca.pem')),
    },
  },
});

module.exports = sequelize;

require('dotenv').config();
const { Sequelize } = require('sequelize');

const host = process.env.LOCALADDRESS;
const user = process.env.USER;
const password = process.env.PASS;
const database = process.env.DATABASE;
const port = process.env.MYSQLPORT;

const sequelize = new Sequelize(database, user, password, { 
  host: host,
  port: port,
  dialect: 'mysql',
});

module.exports = sequelize;

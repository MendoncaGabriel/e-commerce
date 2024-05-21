const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.LOCALADDRESS
const user = process.env.USER
const password = process.env.PASS
const database = process.env.DATABASE

const connection = mysql.createConnection({
    host: host,
    user: user, 
    password: password,
    database: database,
    port: 3306 
})

connection.connect((error) => {
    if (error) {
        console.error('===> ERROR: Erro ao conectar ao banco de dados:', error);
    } else {
        console.log(`===> CONECTADO AO BANCO DE DADOS: ${process.env.LOCALADDRESS}`);
    };
});

module.exports = connection; 
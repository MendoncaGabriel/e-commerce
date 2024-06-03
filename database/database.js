const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.LOCALADDRESS;
const user = process.env.USER;
const password = process.env.PASS;
const database = process.env.DATABASE;
const port = process.env.MYSQLPORT

const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexões no pool
    queueLimit: 0
});

// Testando a conexão ao criar o pool
pool.getConnection((error, connection) => {
    if (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('===> ERROR: Conexão com o banco de dados foi perdida.');
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
            console.error('===> ERROR: Banco de dados tem muitas conexões.');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('===> ERROR: Conexão com o banco de dados foi recusada.');
        } else {
            console.error('===> ERROR: Erro ao conectar ao banco de dados:', error);
        }
    }

    if (connection) connection.release(); // Libera a conexão de volta para o pool

    console.log(`===> CONECTADO AO BANCO DE DADOS: ${process.env.LOCALADDRESS}`);
});

pool.on('release', (connection) => {
    console.log('===> Conexão %d liberada', connection.threadId);
});

module.exports = pool;

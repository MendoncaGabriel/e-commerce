const mysql = require('mysql2');
require('dotenv').config()



const conexao = mysql.createConnection({
    host: process.env.LOCALADDRESS,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
    port: 3306 
  });
   

module.exports = {
    conexao: async () => {
        // Conecta ao banco de dados
        conexao.connect((err) => {
            if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return;
            }
            console.log('Conexão bem-sucedida ao banco de dados.');
        });
  
    },
    db: conexao
}



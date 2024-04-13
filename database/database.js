const mysql = require('mysql2');
require('dotenv').config()



const conexao = mysql.createConnection({
    host: 'database-gam.c3gcao0wi23m.us-east-1.rds.amazonaws.com',
    user: 'gabroviski', 
    password: 'Gam1997Vsc',
    database: 'shopdosbaloes',
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



const mysql = require('mysql2');
require('dotenv').config()

const conexao = mysql.createConnection({
  localAddress: process.env.LOCALADDRESS || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASS || '@Gam1997Vsc*',
  database: process.env.DATABASE || 'shopdosbaloes'
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



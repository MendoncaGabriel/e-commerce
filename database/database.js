const mysql = require('mysql2');
require('dotenv').config()

let localAddress = process.env.LOCALADDRESS || 'localhost'
let user = process.env.USER || 'root'
let password = process.env.PASS || '@Gam1997Vsc*'
let database = process.env.DATABASE || 'shopdosbaloes'

const conexao = mysql.createConnection({
  localAddress: localAddress,
  user: user,
  password: password,
  database: database
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



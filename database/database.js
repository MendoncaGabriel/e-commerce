const mysql = require('mysql2');

const conexao = mysql.createConnection({
  localAddress: 'localhost',
  user: 'root',
  password: '@Gam1997Vsc*',
  database: 'shopdosbaloes'
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



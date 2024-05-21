const db = require('../../database/database');

module.exports = {
    registarPedido: async (status, qtdProduto, data) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO pedidos (status, qtdProduto, data) VALUES (?, ?, ?)";
            const values = [status, qtdProduto, data];

            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    }
}
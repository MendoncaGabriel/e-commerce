const db = require('../../database/database')

module.exports = {
    categorias: async () => {
        return new Promise((resolve, reject)=> {
            // categorias sem repetição e diferente de vazio
            const sql = `SELECT DISTINCT categoria
            FROM produtos
            WHERE produtos.ativo = 1
            AND categoria <> '';
            `;

            db.query(sql, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    }
}
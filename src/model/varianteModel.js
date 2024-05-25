const db = require('../../database/database');

module.exports = {
    create: async (data, produto_id, imagem) => {
      
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO variantes 
                    (produto_id, preco, tamanho, quantidade, referencia, vendas, ean,  estoque, custo, imagem) 
                VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const values = [produto_id, data.preco, data.tamanho, data.quantidade, data.referencia, data.vendas, data.ean, data.estoque, data.custo, imagem];

            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            })
        })
    },
    getById: async (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM variantes WHERE variante_id = ?";
            const values = [id];
            db.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        
        
    },
    getByProdutoId: async (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM variantes WHERE produto_id = ?";
            const values = [id];
            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                    console.log(result)
                }
            })
        })
    },
    update: async (id, data) => {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE variantes SET
                preco = ?,
                tamanho = ?,
                quantidade = ?,
                referencia = ?,
                ean = ?,
                estoque = ?,
                custo = ? ${data.imagem ? ', imagem = ?' : ''}
                WHERE variante_id = ?;
            `;
            const values = [
                data.preco,
                data.tamanho,
                data.quantidade,
                data.referencia,
                data.ean,
                data.estoque,
                data.custo,
                ...(data.imagem ? [data.imagem] : []), 
                id
            ];

            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM variantes WHERE variante_id = ?";
            const values = [id];
            db.query(sql, values, (error, result) => {
                if(error) {
                    reject(error);
                }else{
                    resolve(result);
                }
            })
        })
    }
}
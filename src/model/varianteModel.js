const db = require('../../database/database');
const fs = require('fs')
const path = require('path')

function checkFile(caminhoArquivo){
    try{
        if (fs.existsSync(caminhoArquivo)) {
           return true
        } else {
            return false
        }
    }catch(error){
        console.log(error.message)
    }
}
function deleteFile(caminhoArquivo){
    try {
        fs.unlink(caminhoArquivo, function (error){
            if (error) throw new Error(error);

        })
    }
    catch (error) {
        console.log(error.message)
    }
}
async function apagarImagemAnterior(id){
    try {
        const produto = await module.exports.getById(id)
        const image = produto[0]?.imagem;
        const caminhoArquivo = path.resolve('src', 'public', 'img', image);
        if(!caminhoArquivo) throw new Error('Erro ao buscar caminho de arquivo!')
        const existsFile = checkFile(caminhoArquivo);
        if(existsFile) deleteFile(caminhoArquivo);
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    create: async (data, produto_id, imagem) => {
      
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO variantes 
                    (produto_id, preco, nome, cor tamanho, quantidade, referencia, vendas, ean,  estoque, custo, imagem) 
                VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const values = [produto_id, data.preco, data.nome, data.cor, data.tamanho, data.quantidade, data.referencia, data.vendas, data.ean, data.estoque, data.custo, imagem];

            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            })
        })
    },
    getByProdutoId: async (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM variantes WHERE produto_id = ?";
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
                }
            })
        })
    },
    update: async (id, data, imagem) => {
        if (imagem) {
            await apagarImagemAnterior(id);
        }
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE variantes SET
                ativo = ?,
                preco = ?,
                nome = ?,
                cor = ?,
                tamanho = ?,
                quantidade = ?,
                referencia = ?,
                ean = ?,
                estoque = ?,
                custo = ?
                ${imagem ? ', imagem = ?' : ''}
                WHERE variante_id = ?;
            `;
            const values = [
                ativo = data.ativo == 'on' ? 1 : 0,
                data.preco,
                data.nome,
                data.cor,
                data.tamanho,
                data.quantidade,
                data.referencia,
                data.ean,
                data.estoque,
                data.custo,
                ...(imagem ? [imagem] : []), 
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
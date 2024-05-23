const executeSql = require('../utilities/executarSql')
const fs = require('fs');
const path = require('path');
const db = require('../../database/database');


module.exports = {

    create: async (nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO produtos (nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            const values = [nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem];
            
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
        return new Promise((resolve, rejects) => {
            const sql = "SELECT * FROM produtos WHERE produto_id = ?;";
            const values = [id];

            db.query(sql, values, (error, result) => {
                if(error){
                    rejects(error);
                }else{
                    resolve(result);
                }
            });
        })
    },
    getProdutoWithVariantes: async (nome) => {
        try {
            const sql = `
            SELECT p.*, v.*
            FROM produtos p
            LEFT JOIN variantes v ON p.produto_id = v.produto_id
            WHERE LOWER (REPLACE(p.nome, ' ', '-') = ?);`;

            let nomeLoweCase = nome.toLowerCase()
            const values = [nomeLoweCase]
            const result = await executeSql(sql, values)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro no modulo produtoComVariantes ao pegar produto", error)
        }
    },
    getByCategoria: async (categoria) => {
        const sql = `
        SELECT produtos.*, variantes.*
        FROM produtos 
        JOIN variantes ON produtos.produto_id = variantes.produto_id
        WHERE produtos.categoria = ?`;

        const values = [categoria];
        const result = await  executeSql(sql, values);
        return result;
    },
    getbyOffset: async (offset, limit) => {
        const sql = `SELECT * FROM produtos LIMIT ? OFFSET ?;`;
    
        const values = [limit, offset];
        const result = await executeSql(sql, values);
        return result
    },
    update: async (id, nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem) => {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE produtos SET 
                    nome = ?, 
                    modelo = ?, 
                    marca = ?, 
                    categoria = ?, 
                    preco = ?, 
                    tamanho = ?, 
                    quantidade = ?, 
                    referencia = ?, 
                    ean = ?, 
                    estoque = ?, 
                    custo = ?, 
                    descricao = ?, 
                    imagem = ?
                WHERE produto_id = ?;
            `;

            const values = [
                nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem, id
            ];

            db.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    },
    delete: async (id) => {
        try {
            // buscando produto 
            const produto = await  executeSql(`
                SELECT p.*, v.* 
                FROM produtos p 
                LEFT JOIN variantes v ON p.produto_id = v.produto_id 
                WHERE p.produto_id = ${id}
            `)

            //separar imagens
            const imagens = produto.map(produto => {
                if (produto.imagem.length > 0) {
                    return produto.imagem;
                }
            });
            
  
            
            imagens.forEach(e =>{
    
                // verificar se existe imagem
                const caminho = path.resolve('public', 'images', e)
                fs.access(caminho, fs.constants.F_OK, (erro) => {
                    if(erro){
                        console.log('arquivo não existe')
                    }else{
                        console.log('arquivo existe, excluir')

                        //excluir arquivos
                        fs.unlink(caminho, (err)=>{
                            if(err){
                                console.log('erro ao excluir imagem', caminho)
                            }else{
                                console.log('arquivo excluido com sucesso!', caminho)
                            }

                        })
    
                    }
                })

            })
       


      

            await executeSql('DELETE FROM variantes WHERE produto_id = ?;', [id])
            const p = await executeSql('DELETE FROM produtos WHERE produto_id = ?;', [id])

            return p

        } catch (error) {
            throw new Error("Erro ao remover produto")
        }
    }
}
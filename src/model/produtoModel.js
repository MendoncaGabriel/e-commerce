const fs = require('fs');
const path = require('path');
const db = require('../../database/database');

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


function getImagemProduto(produto_id){
    return new Promise( (resolve, reject)=>{
       db.query("select imagem from produtos where produto_id = ? AND imagem IS NOT NULL AND imagem != '';", [produto_id], (error, result) => {
            if(error){
                reject(error)
            }else{
                resolve(result)
            }
        })
    })
}
function getImagemVariante(produto_id){
    return new Promise( (resolve, reject)=>{

       db.query("select imagem from variantes where produto_id = ? AND imagem IS NOT NULL AND imagem != '';", [produto_id], (error, result) => {
            if(error){
                reject(error)
            }else{
                resolve(result)
            }
        })
    })
}
function deleteVariantes(produto_id) {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM variantes WHERE produto_id = ?", [produto_id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
function deleteProduto(produto_id) {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM produtos WHERE produto_id = ?", [produto_id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}


module.exports = {
    create: async (data, imagem) => {

        return new Promise((resolve, reject) => {
            const sql = `
            INSERT INTO produtos 
                (nome, descricao, ativo, marca, modelo, preco, tamanho, quantidade, referencia, vendas, ean, estoque, custo, imagem, categorias_categoria_id) 
            VALUES 
                (?, ?, 1, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?);`;
    
            const values = [
                data.nome,
                data.descricao,
                data.marca,
                data.modelo,
                data.preco,
                data.tamanho,
                data.quantidade,
                data.referencia,
                data.ean,
                data.estoque || 0,
                data.custo || null,
                imagem,
                data.categoria
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
    //-----------------
    getById: async (id) => {
        return new Promise((resolve, rejects) => {
            const sql = `SELECT * FROM produtos WHERE produto_id = ?;`;

            const values = [id];
            db.query(sql, values, (error, result) => {
                if(error){
                    rejects(error);
                }else{
                    resolve(result);
                }
            });
        });
    },
    getByIdWithCategoria: async (id) => {
        return new Promise((resolve, rejects) => {
            const sql = `SELECT produtos.*, categorias.*
            FROM produtos, categorias
            WHERE produtos.produto_id = ?;`;

            const values = [id];
            db.query(sql, values, (error, result) => {
                if(error){
                    rejects(error);
                }else{
                    resolve(result);
                }
            });
        });
    },
    getByName: async (nome) => {
        return new Promise((resolve, rejects) => {
            const sql = "SELECT * FROM produtos WHERE LOWER(REPLACE(nome, ' ', '-')) = ?;";
            let nomeLowerCase = nome.toLowerCase().replace(/ /g, '-');
            const values = [nomeLowerCase];

            db.query(sql, values, (error, result) => {
                if(error){
                    return rejects(error)
                }else{
                    resolve(result)
                }
            })
        })
    },
    getByCategoria: async (categoria) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM produtos JOIN categorias ON categorias.nome_categoria = ? AND categorias.categoria_id = produtos.categorias_categoria_id;`;
            const values = [categoria];

            db.query(sql, values, (error, result) =>{
                if(error){
                    return reject(error);
                }else{
                    resolve(result);
                };
            });
        });
    },


    getbyOffsetAll: async (offset, limit) => { 
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM produtos  LIMIT ? OFFSET ?;`;
            const values = [limit, offset];
            
            db.query(sql, values, (error, result) => {
                if(error){
                    return reject(error)
                }else{
                    resolve(result)
                }
            })

        })
    },
    getByOffsetAndActive: async (offset, limit) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM produtos LIMIT ? OFFSET ?;"
            const values = [limit, offset   ];
            db.query(sql, values, (error, result) => {
                if(error){
                    return reject(error);
                }else{
                    console.log(result)
                    resolve(result)  ;              
                };
            });
        });
    },
    //-----------------
    update: async (id, ativo, nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem) => {
        if (imagem) {
            await apagarImagemAnterior(id);
        }

        return new Promise((resolve, reject) => {
            let sql = `
                UPDATE produtos SET 
                ativo = ?,
                nome = ?, 
                modelo = ?, 
                marca = ?, 
                categorias_categoria_id = ?, 
                preco = ?, 
                tamanho = ?, 
                quantidade = ?, 
                referencia = ?, 
                ean = ?, 
                estoque = ?, 
                custo = ?, 
                descricao = ?
            `;

            const values = [ativo, nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao];

            if (imagem) {
                sql += `, imagem = ?`;
                values.push(imagem);
            }

            sql += ` WHERE produto_id = ?;`;
            values.push(id);

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
        return new Promise((resolve, reject)=>{
            (async ()=>{
                try {
                    //pegar imagens de variantes 
                    const imagensVariantes = await getImagemVariante(id)
    
                    //remover imagens de variantes
                    if(imagensVariantes.length > 0){
                        imagensVariantes.forEach(element => {
                            const filePath = path.resolve('src', 'public', 'img', element.imagem);
                            const fileExists = checkFile(filePath)
                            if(fileExists){
                                deleteFile(filePath)
                            }
                        });
                    }
                        
                    //remover variantes relacionadas
                    await deleteVariantes(id)
            
                    //remover imagem de produto
                    const imagemProduto = await getImagemProduto(id)
                    if(imagemProduto.length > 0){
                        imagemProduto.forEach(element => {
                            const filePath = path.resolve('src', 'public', 'img', element.imagem);
                            const fileExists = checkFile(filePath)
                            if(fileExists){
                                deleteFile(filePath)
                            }
                        })
                    }
    
                    //remover produto
                    await deleteProduto(id)
    
                    resolve("item produtos, imagens e variantes deletados com sucesso!")
    
                } catch (error) {
                    reject(error)
                }
            })()
            
        })
    }
}
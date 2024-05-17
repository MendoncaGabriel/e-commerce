const executeSql = require('../utilities/executarSql')
const fs = require('fs');
const path = require('path');
const db = require('../../database/database');

module.exports = {
    crate: async (data) => {
        try {
            const sql = `INSERT INTO produtos ( nome, descricao, ativo, modelo, marca, categoria)
            VALUES (?, ?, ?, ?, ?, ?);`;

            const values = [data.nome, data.descricao, data.ativo, data.modelo, data.marca, data.categoria]

            const result = await  executeSql(sql, values)
            return result

        } catch (error) {
            console.log(error)
            throw new Error("Erro ao salvar novo produto", error)
        }
    },
    getById: async (id) => {
        try {
            const sql = "SELECT * FROM produtos WHERE produtos.produto_id = ?"
            const values = [id]
            const result = await executeSql(sql, values)
            return result

            
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar produto", error)
        }
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
        const sql = `
        SELECT produtos.*, variantes.*
        FROM produtos
        JOIN variantes ON produtos.produto_id = variantes.produto_id
        WHERE produtos.ativo = 1
        AND variantes.imagem IS NOT NULL
        AND variantes.imagem <> ''
        AND variantes.estoque > 0
        LIMIT ? OFFSET ?;
        `;
    
        const values = [limit, offset];
        const result = await executeSql(sql, values);
        return result
    },
    update: async (id, data) => {
        try {
            let updateFields = '';
            const values = []

            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    updateFields += `${key} = ?, `;
                    values.push(data[key]);
                }
            }

            values.push(Number(id));

            // Remova a vírgula extra do final da string updateFields
            updateFields = updateFields.slice(0, -2);

            //atualizar produto
            const result = await  executeSql(`
                UPDATE produtos
                    SET ${updateFields}
                WHERE produto_id = ?;
            `, values)

            return result

        } catch (error) {
            console.log(error)
            throw new Error("Erro ao atualizar produto", error)
        }
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
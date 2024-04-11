const db = require('../database/database').db

function executeSql(sql, values){
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, retorno) => {
            if(error){
                let resumoErro = {
                    sqlState: error.sqlState || '?',
                    sqlMessage: error.message || ""
                } 
                console.log(resumoErro)
                reject(new Error("Erro ao remover produto!", {error: resumoErro || error}))
            }else{
                resolve(retorno)
            }
        })
    })
}

module.exports = {
    novoProduto: async (data) => {
        try {
            const sql = `INSERT INTO produtos ( nome_produto, descricao_produto, status_produto, modelo_produto, marca, categoria)
            VALUES (?, ?, ?, ?, ?, ?);`;

            const values = [data.nome_produto, data.descricao_produto, data.status_produto, data.modelo_produto, data.marca, data.categoria]

            const result = await  executeSql(sql, values)
            return result

        } catch (error) {
            throw new Error("Erro ao salvar novo produto", error)
        }
    },
    pegarProdutoId: async (id) => {
        try {

            const sql = `
                SELECT produtos.*, variantes.*
                FROM produtos
                JOIN variantes ON produtos.produto_id = variantes.variante_id;
            `
            const values = [id]

            const result = await executeSql(sql, values)
            return result

            
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar produto", error)
        }
    },
    novaVariante: async (data) => {
        try {
            const sql = `
                INSERT INTO variantes 
                    (produto_id, preco, tamanho, quantidade, referencia, vendas, ean,  estoque, custo, imagem) 
                VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `
            const values = [data.produto_id, data.preco, data.tamanho, data.quantidade, data.referencia, data.vendas, data.ean, data.estoque, data.custo, data.imagem]

            const result = await  executeSql(sql, values)
            return result

            
        } catch (error) {
            throw new Error("Erro ao  inserir nova variante", error)
        }
    },
    listaProdutos: async (pg, Limit) => {
        try {
            const limit = Limit || 20;
            const pagina = pg || 1;
            const offset = (pagina - 1) * limit;
            const sql = `
                SELECT * FROM produtos
                ORDER BY produto_id
                LIMIT ?, ?;
            `
            const values = [offset, limit];

            const result = await  executeSql(sql, values)
            return result
            
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar lista de produtos", error)
        }
    },
    atualizarProduto: async (id, data) => {
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

            const sql = `
                UPDATE produtos
                    SET ${updateFields}
                WHERE produto_id = ?;
            `;

            const result = await  executeSql(sql, values)
            return result

        } catch (error) {
            console.log(error)
            throw new Error("Erro ao atualizar produto", error)
        }
    },
    atualizarVariante: async (id, data) => {
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

            const sql = `
                UPDATE variantes
                    SET ${updateFields}
                WHERE variante_id = ?;
            `;


            const result = await  executeSql(sql, values)
            return result

        } catch (error) {
            console.log(error)
            throw new Error("Erro ao atualizar variante", error)
        }
    },


    removerProduto: async (id) => {
        try {

            const v = await executeSql('DELETE FROM variantes WHERE produto_id = ?;', [id])
            const p = await executeSql('DELETE FROM produtos WHERE produto_id = ?;', [id])

            return p

        } catch (error) {
            throw new Error("Erro ao remover produto")
        }
    }
}
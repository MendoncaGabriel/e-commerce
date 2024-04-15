const executeSql = require('../utilities/executarSql')
const fs = require('fs');
const path = require('path')

module.exports = {
    novoProduto: async (data) => {
        try {
            const sql = `INSERT INTO produtos ( nome_produto, descricao_produto, status_produto, modelo_produto, marca, categoria)
            VALUES (?, ?, ?, ?, ?, ?);`;

            const values = [data.nome_produto, data.descricao_produto, data.status_produto, data.modelo_produto, data.marca, data.categoria]

            const result = await  executeSql(sql, values)
            return result

        } catch (error) {
            console.log(error)
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
            console.log(error)
            throw new Error("Erro ao  inserir nova variante", error)
        }
    },
    listaProdutos: async (pg, Limit) => {
        try {
            const limit = Limit || 20;
            const pagina = pg || 1;
            const offset = (pagina - 1) * limit;
            const sql = `
                SELECT p.*, v.*
                FROM produtos p
                LEFT JOIN variantes v ON p.produto_id = v.produto_id
                ORDER BY p.produto_id
                LIMIT ?, ?;
            `
            const values = [offset, limit];
            const result = await  executeSql(sql, values)
            return  result
            
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
    atualizarVariante: async (id, data, imagem) => {
        try {
            //BUSCAR VARIANTE
            const variante = await executeSql(`
                SELECT * FROM variantes WHERE variante_id = ${id};
            `)

            //VERIFICAR SE IMAGEM ANTIGA EXISTE, E APAGAR
            if(imagem && variante.length > 0 && variante[0].imagem){
                const caminho = path.resolve('public', 'images', variante[0].imagem);
                fs.access(caminho, fs.constants.F_OK, (erro) => {
                    if(erro){
                        console.log('Sem imagem antiga')
                    }else{
                        console.log('Imagem antiga encontradada, apagar!')
                        fs.unlink(caminho, (err) => {
                            if(err){
                                console.log('erro ao excluir imagem')
                            }else{
                                console.log('imagem antiga excluida!')
                            }
                        })
                    }
                })
            }


            let updateFields = '';
            const values = []

            // SE TIVER IMAGEM, ATUALIZA CAMPO COM NOME DO ARQUIVO
            if (imagem) {
                updateFields += `imagem = ?, `;
                values.push(imagem[0]); 
            }

            // MONTA SET DE ATUALIZAÇÃO
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    updateFields += `${key} = ?, `;
                    values.push(data[key]);
                }
            }

            values.push(Number(id));
            updateFields = updateFields.slice(0, -2);

            // ATUALIZA VARIANTE
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
    },
    variantes: async (produto_id) => {
        try {
            const sql = ` SELECT * FROM variantes WHERE produto_id = ?`
            const values = [produto_id]
            const result = await executeSql(sql, values)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar lista de variantes", error)
        }
    },
    produtoComVariantes: async (nome) => {
        try {
            const sql = `
            SELECT p.*, v.*
            FROM produtos p
            LEFT JOIN variantes v ON p.produto_id = v.produto_id
            WHERE LOWER (REPLACE(p.nome_produto, ' ', '-') = ?);
            `
            let nomeLoweCase = nome.toLowerCase()
            const values = [nomeLoweCase]
            const result = await executeSql(sql, values)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar produto", error)
        }
    }
}
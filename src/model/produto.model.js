const executeSql = require('../utilities/executarSql')
const fs = require('fs');
const path = require('path');

module.exports = {
    novoProduto: async (data) => {
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
    pegarProdutoId: async (id) => {
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
    pegarVarianteId: async (id) => {
        try {
            const sql = "SELECT * FROM variantes WHERE variantes.variante_id = ?"
            const values = [id]
            const result = await executeSql(sql, values)
            return result

            
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar variante", error)
        }
    },
    pegarVarianteDoProduto: async (id) => {
        try {
            const sql = "SELECT * FROM variantes WHERE variantes.produto_id = ?"
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
            LEFT JOIN (
                SELECT *
                FROM variantes
                GROUP BY produto_id
            ) v ON p.produto_id = v.produto_id
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
    atualizarVariante: async (id, data) => {
        if (!id) return console.log('Sem id');
        if (!data) return console.log('Sem data');
    
        try {
            // BUSCAR VARIANTE
            const variante = await executeSql(`SELECT * FROM variantes WHERE variante_id = ?;`, [id]);
    
            if (variante.length === 0) {
                console.log('Variante não encontrada');
                return;
            }
    
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
        
        // Define os valores a serem atualizados
        const values = [
            data.preco,
            data.tamanho,
            data.quantidade,
            data.referencia,
            data.ean,
            data.estoque,
            data.custo,
            // Adiciona a imagem apenas se ela estiver definida
            ...(data.imagem ? [data.imagem] : []), 
            id
        ];
        
    
            const result = await executeSql(sql, values);
    
            return result;
        } catch (error) {
            console.log('Erro ao atualizar variante:', error);
            throw new Error("Erro ao atualizar variante", error);
        }
    },
    removerVariante: async (id) => {
        try {

            console.log(id)
            // buscando produto 
            const variante = await  executeSql(`
                SELECT * FROM variantes WHERE variante_id = ?;
            `, [id])


            
            // verificar se existe imagem
            if(variante[0].imagem){
                const caminho = path.resolve('public', 'images', variante[0].imagem)

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
            }

            


            const result = await executeSql('DELETE FROM variantes WHERE variante_id = ?', [id])
           

            return result

        } catch (error) {
            console.log(error)
            throw new Error("Erro ao remover variante")
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
            if(!nome) throw new Error('nome não espesicifaco ')
            const sql = `
            SELECT p.*, v.*
            FROM produtos p
            LEFT JOIN variantes v ON p.produto_id = v.produto_id
            WHERE LOWER (REPLACE(p.nome, ' ', '-') = ?);
            `
            let nomeLoweCase = nome.toLowerCase()
            const values = [nomeLoweCase]
            const result = await executeSql(sql, values)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro no modulo produtoComVariantes ao pegar produto", error)
        }
    },
    processarCheckOut: async (carrinho) => {
        
        const mapaItens = new Map();
        carrinho.forEach(item => {
            const chave = `${item.produto_id}-${item.variante_id}`;
            if (mapaItens.has(chave)) {
                // Se o item já existir no mapa, adicione a quantidade
                mapaItens.get(chave).qtdProduto += item.qtdProduto;
            } else {
                // Se o item não existir no mapa, adicione-o
                item.qtdProduto = item.qtdProduto
                mapaItens.set(chave, { ...item });
            }
        });

        // Converter o mapa de volta para um array
        const itensAgrupados = Array.from(mapaItens.values());
      
        console.log('===> itensAgrupados: ', itensAgrupados);
        const itens = []
    
        for (const e of itensAgrupados) {
      
            try {
                const item = await executeSql(`SELECT v.*, p.nome AS nome_produto
                FROM variantes v
                JOIN produtos p ON v.produto_id = p.produto_id
                WHERE v.variante_id = ? AND p.produto_id = ?;
                `, [e.variante_id, e.produto_id])
                
                item[0].qtdProduto = e.qtdProduto
                itens.push(item[0]);
            } catch (error) {
                console.error('Erro ao executar a consulta SQL:', error);
            }
        }
        
        let total = 0
        itens.forEach(e =>{
            let valor = e.preco * e.qtdProduto
            total = total + valor
        })

        total = String(total).replace('.', ',')

        //calcular total
        return {itens, total}
    }
}
const produtoModel = require('../model/produtoModel')

module.exports = {
    novoProduto: async (req, res) => {
      
        try {

            const produto = JSON.parse(req.body.produto)
            const variantes = JSON.parse(req.body.variantes)
            const result = await produtoModel.novoProduto(produto)
            const produto_id = result.insertId
     
            
            if (variantes.length > 0) {
                // Mapeie as variantes para promessas de inserção e aguarde todas elas serem resolvidas
                await Promise.all(variantes.map(async (variante, index) => {
                    variante.produto_id = Number(produto_id);
                    variante.preco = parseFloat(variante.preco.replace(',', '.')); 
                    variante.tamanho = variante.tamanho || null;
                    variante.referencia = variante.referencia || null;
                    variante.ean = variante.ean || null;
                    variante.quantidade = parseInt(variante.quantidade) || 0;
                    variante.estoque = parseInt(variante.estoque) || 0;
                    variante.custo = parseFloat(variante.custo.replace(',', '.')) || null;
                    // variante.imagem = req.imagens[index] != "undefined" ? req.imagens[index] : null;
                    variante.vendas = 0;
                    if (req.imagens && Array.isArray(req.imagens)) {
                        // Aqui você pode usar req.imagens[index] com segurança
                        variante.imagem = req.imagens[index] !== undefined ? req.imagens[index] : null;
                    } else {
                        // Se req.imagens não estiver definido ou não for um array, você pode lidar com isso de acordo com a lógica do seu aplicativo
                        console.error('req.imagens não está definido ou não é um array');
                    }
                    
                    // Aguarde a inserção da variante
                    await produtoModel.novaVariante(variante);
                }));
            }

            res.status(200).json({msg: "Novo produto criado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    pegarProdutoId: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.pegarProdutoId(id)
            res.status(200).json({msg: "Produto resgatado com sucesso!", result})
        } catch (error) {
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    novaVariante: async (req, res) => {
        try {   
            const data = req.body
            const result = await produtoModel.novaVariante(data)
            res.status(200).json({msg: 'Nova variante de produto criada com sucesso!', result})

        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    listaProdutos: async (req, res) => {
        try {
            const pg = req.params.pg
            const limit = Number(req.query.limit || 20)
            const result = await produtoModel.listaProdutos(pg, limit)

            res.status(200).json({msg: "Lista de produtos resgatada com sucesso!", result})
            
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }

    },
    atualizarProduto: async (req, res) => {
        try {
            const id = req.params.id
            const data = req.body
            const result = await produtoModel.atualizarProduto(id, data)

            res.status(200).json({msg: "Produto atualizado com sucesso!", result})

        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    removerProduto: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.removerProduto(Number(id))

            res.status(200).json({msg: "Produto deletado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no servidor')
        }
    },
    atualizarVariante: async (req, res) => {
        try {
            const id = req.params.id
            const data = req.body
            const result = await produtoModel.atualizarVariante(id, data)
            res.status(200).json({msg: 'Variante atualizada com sucesso!', result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    }
}

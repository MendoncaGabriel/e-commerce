const produtoModel = require('../../model/produtoModel');

module.exports = {
    novoProduto: async (req, res) => {
        try {
            // Salvando produto
            const produto = JSON.parse(req.body.produto)
            const result = await produtoModel.novoProduto(produto)

            // Salvando Variante
            const variantes = JSON.parse(req.body.variantes)
            const produto_id = result.insertId
     
            if (variantes.length > 0) {
                await Promise.all(variantes.map(async (variante, index) => {
                    variante.produto_id = Number(produto_id);
                    variante.preco = parseFloat(variante.preco.replace(',', '.')); 
                    variante.tamanho = variante.tamanho || null;
                    variante.referencia = variante.referencia || null;
                    variante.ean = variante.ean || null;
                    variante.quantidade = parseInt(variante.quantidade) || 0;
                    variante.estoque = parseInt(variante.estoque) || 0;
                    variante.custo = parseFloat(variante.custo) || null;
                    variante.estoque = parseInt(variante.estoque) || null;
                    variante.vendas = 0;
        
                    await produtoModel.novaVariante(variante);
                }));
            }
            res.status(200).json({msg: "Novo produto criado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    pegarVarianteId: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.pegarVarianteId(id)
            res.status(200).json({msg: "Variante resgatado com sucesso!", result})
        } catch (error) {
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
            const id = req.params.id; //id de produto
            const produto = JSON.parse(req.body.produto);
            const variantes = JSON.parse(req.body.variantes);

            // Atualizar o produto
            await produtoModel.atualizarProduto(id, produto);

            // Atualizar as variantes
            await Promise.all(variantes.map(async (variante, index) => {
                if(variante.variante_id == 'novo'){
                    const novaVariante = variante
                    novaVariante.produto_id = id
                    typeof novaVariante.imagem !== "undefined" && novaVariante.imagem ?  novaVariante.imagem = variante.imagem.replace('.jpeg', '.png').replace('.jpg', '.png').replace('.webp', '.png') : ''
                    delete novaVariante.variante_id
                    const result = await produtoModel.novaVariante(novaVariante)
                }
                await produtoModel.atualizarVariante(variante.variante_id, variante);
            }));

            res.status(200).json({ msg: "Produto atualizado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro interno no servidor' });
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
    removerVariante: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.removerVariante(id)
            res.status(200).json({msg: "Variante deletada com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no servidor')
        }
    },

}

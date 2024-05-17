const produtoModel = require('../../model/produtoModel');

module.exports = {
    create: async (req, res) => {
        try {
            // Salvando produto
            const produto = JSON.parse(req.body.produto)
            const result = await produtoModel.crate(produto)

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
    getById: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.getById(id)
            res.status(200).json({msg: "Produto resgatado com sucesso!", result})
        } catch (error) {
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getProdutoWithVariantes: async (req, res) => {
        try {
            const id = req.params.name;
            const result = await produtoModel.getProdutoWithVariantes(id);
            res.status(200).json({msg: "Produto resgatado com sucesso!", result});
        } catch (error) {
            res.status(500).json({msg: 'Erro interno no servidor'});
        }
    },
    getByCategoria: async (req, res) => {
        try {
            const categoria = req.params.categoria;
            const result = await produtoModel.getByCategoria(categoria);
            res.status(200).json({msg: "Produtos pegos por categoria", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getByOffset: async (req, res) => {
        try {
            const offset = Number(req.query.offset || 0);
            const limit = Number(req.query.limit || 20);
            const result = await produtoModel.getbyOffset(offset, limit)
            res.status(200).json({msg: "Lista de produtos resgatada com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id; //id de produto
            const produto = JSON.parse(req.body.produto);
            const variantes = JSON.parse(req.body.variantes);

            // Atualizar o produto
            await produtoModel.update(id, produto);

            // Atualizar as variantes
            await Promise.all(variantes.map(async (variante, index) => {
                if(variante.variante_id == 'novo'){
                    const novaVariante = variante
                    novaVariante.produto_id = id
                    typeof novaVariante.imagem !== "undefined" && novaVariante.imagem ?  novaVariante.imagem = variante.imagem.replace('.jpeg', '.png').replace('.jpg', '.png').replace('.webp', '.png') : ''
                    delete novaVariante.variante_id
                    const result = await produtoModel.crate(novaVariante)
                }
                await produtoModel.update(variante.variante_id, variante);
            }));

            res.status(200).json({ msg: "Produto atualizado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro interno no servidor' });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.delete(Number(id))
            res.status(200).json({msg: "Produto deletado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no servidor')
        }
    }
}
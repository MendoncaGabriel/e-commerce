const produtoModel = require('../model/produtoModel')

module.exports = {
    novoProduto: async (req, res) => {
        try {
            const data = req.body
            const result = await produtoModel.novoProduto(data)
            res.status(200).json({msg: "Novo produto criado com sucesso!", result})
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
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    removerProduto: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.removerProduto(Number(id))

            res.status(200).json({msg: "Produto deletado com sucesso!", result})
        } catch (error) {
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
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    }
}

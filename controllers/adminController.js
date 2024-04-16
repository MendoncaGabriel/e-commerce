const produtoModel = require('../model/produtoModel')

module.exports = {
    home: (req, res) => {
        res.render('admin/layout', {titulo: 'home'})
    },
    cadastroProduto: (req, res) => {
        res.render('admin/layout', {conteudo: './conteudo/cadastroProduto', titulo: 'Cadastro de Produto'})
    },
    edicaoProduto: async (req, res) => {
        const id = req.params.id
        const produto = await produtoModel.pegarProdutoId(id)
        const variantes = await produtoModel.pegarVarianteDoProduto(id)
        res.render('admin/layout', {
            conteudo: './conteudo/edicaoProduto', 
            titulo: 'Edição de Produto',
            produto: produto,
            variantes: variantes
        })
    },
    listaProduto: async (req, res) => {
        const produtos = await produtoModel.listaProdutos(1)
        res.render('admin/layout', {
            titulo: 'Lista de produto',
            conteudo: './conteudo/listaProduto', 
            produtos: produtos
        })

    }
}
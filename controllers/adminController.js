const produtoModel = require('../model/produtoModel')
const caregoriaModel = require('../model/categoriaModel')

module.exports = {
    home: (req, res) => {
        res.render('admin/layout', {titulo: 'home'})
    },
    cadastroProduto: async (req, res) => {
        const categorias = await caregoriaModel.categorias()
        res.render('admin/layout', {conteudo: './conteudo/cadastroProduto', titulo: 'Cadastro de Produto', categorias})
    },
    edicaoProduto: async (req, res) => {
        const id = req.params.id
        const produto = await produtoModel.pegarProdutoId(id);
        const variantes = await produtoModel.pegarVarianteDoProduto(id);
        const categorias = await caregoriaModel.categorias()


        res.render('admin/layout', {
            conteudo: './conteudo/edicaoProduto', 
            titulo: 'Edição de Produto',
            produto: produto,
            variantes: variantes,
            categorias: categorias
        })
    },
    listaProduto: async (req, res) => {
        const produtos = await produtoModel.listaProdutos(1)
        res.render('admin/layout', {
            titulo: 'Lista de produto',
            conteudo: './conteudo/listaProduto', 
            produtos: produtos
        })

    },
    categorias: async (req, res) => {
        const categorias = await caregoriaModel.categorias()
        res.render('admin/layout', {
            titulo: 'Categorias',
            conteudo: './conteudo/categorias',
            categorias: categorias
        })
    },

}
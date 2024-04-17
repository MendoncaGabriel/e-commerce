const produtoModel = require('../model/produtoModel')
const categoriaModel = require('../model/categoriaModel')


module.exports = {
    home: async (req, res) => {
        try {
            const produtos = await produtoModel.listaProdutos(1)

            const  produtosFiltrados = produtos.filter((e)=>{
               return e.ativo == 1 && e.imagem !== null && e.estoque > 0
            })

            console.log(produtosFiltrados)
            const categorias = await categoriaModel.categorias()
            res.render('ecommerce/home', {
                carrosel_1_titulo: 'Novidades', 
                carrosel_1_data: produtosFiltrados, 
                categorias
            })
        } catch (error) {
            console.log(error)
        }

    },
    produtos: async (req, res) => {
        try {
            const nome = req.params.nome
            const produto = await produtoModel.produtoComVariantes(nome)
            const produtos = await produtoModel.listaProdutos(1, 10)
            console.log(produto)
            
            res.render('ecommerce/produtos', {produto, produtos})
        } catch (error) {
            console.log(error)
        }
    },
    checkout: async (req, res) => {
        try {
            
            
            res.render('ecommerce/checkout')
        } catch (error) {
            console.log(error)
        }
    }
}



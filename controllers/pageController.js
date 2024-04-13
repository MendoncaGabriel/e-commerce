const produtoModel = require('../model/produtoModel')
const categoriaModel = require('../model/categoriaModel')


module.exports = {
    home: async (req, res) => {
        try {
            const produtos = await produtoModel.listaProdutos(1)
            const categorias = await categoriaModel.categoriasMenu()
            console.log(JSON.stringify(categorias))

            res.render('ecommerce/home', {produtos, categorias})
        } catch (error) {
            console.log(error)
        }

    },
    produtos: async (req, res) => {
        try {
            const nome = req.params.nome
            const produto = await produtoModel.produtoComVariantes(nome)
            
            res.render('ecommerce/produtos', {produto})
        } catch (error) {
            console.log(error)
        }
    }
}



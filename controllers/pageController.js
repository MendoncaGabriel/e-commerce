const produtoModel = require('../model/produtoModel')



module.exports = {
    home: async (req, res) => {
        try {
            const produtos = await produtoModel.listaProdutos(1)

            res.render('ecommerce/home', {produtos})
        } catch (error) {
            console.log(error)
        }

    },
    produtos: async (req, res) => {
        try {
            const id = req.query.id
            const produto = await produtoModel.produtoComVariantes(id)
            
            res.render('ecommerce/produtos', {produto})
        } catch (error) {
            console.log(error)
        }
    }
}



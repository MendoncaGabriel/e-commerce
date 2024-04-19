const produtoModel = require('../../model/produto.model')
const categoriaModel = require('../../model/categoria.model')
const empresa = require('../../model/config.model')

module.exports = {
    home: async (req, res) => {
        try {
            const produtos = await produtoModel.listaProdutos(1)
            const dadosEmpresa = await empresa.dados()
      
            // filtrar produtos
            const  produtosFiltrados = produtos.filter((e)=>{
               return e.ativo == 1 && e.imagem !== null && e.estoque > 0
            })

            const categorias = await categoriaModel.categorias()
            res.render('loja/home', {
                carrosel_1_titulo: 'Novidades', 
                carrosel_1_data: produtosFiltrados, 
                categorias: categorias,
                dadosEmpresa: dadosEmpresa
            })
        } catch (error) {
            console.log(error)
        }
    },
    produto: async (req, res) => {
        try {
            const nome = req.params.nome
            const produto = await produtoModel.produtoComVariantes(nome)
            const dadosEmpresa = await empresa.dados()
            
            res.render('loja/produtos', {produto, dadosEmpresa})
        } catch (error) {
            console.log(error)
        }
    },
    checkout: async (req, res) => {
        try {
               
            res.render('loja/checkout')
        } catch (error) {
            console.log(error)
        }
    },
    criarConta: async (req, res) => {
        try{
           
        }catch(error){
            console.log(error)
            res.status(500).send('Erro Interno no servidor!')
        }
    }
}


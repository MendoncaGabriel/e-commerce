const pesquisaModel = require('../model/pesquisaModel');
const empresaModel = require('../model/empresaModel');
const categoriaModel = require('../model/categoriaModel');


module.exports = {
    busca: async (req, res) => {
        try {
            const {termo} = req.body;
            const dadosEmpresa = await empresaModel.dados();
            const categorias = await categoriaModel.categorias();
            let produtosCategoria = await pesquisaModel.getBySearchTerm(termo)
           

            const data = {
                titulo: termo,
                categorias: categorias,
                dadosEmpresa: dadosEmpresa,
                produtosCategoria: produtosCategoria,
                tituloCategoria: termo
            }

            res.render('loja/pesquisa', data)
        } catch (error) {
            console.log(error)
            res.render('500')
        }

    }
}
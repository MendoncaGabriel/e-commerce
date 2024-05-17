const pesquisaModel = require('../model/pesquisaModel');
const empresaModel = require('../model/empresaModel');
const categoriaModel = require('../model/categoriaModel');

async function getDataCategorias(req){
    return new Promise( async (resolve, reject) => {
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
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    busca: async (req, res) => {
        try {
            const data = await getDataCategorias(req)
            res.render('loja/pesquisa', data)
        } catch (error) {
            console.log(error)
            res.render('500')
        }

    }
}
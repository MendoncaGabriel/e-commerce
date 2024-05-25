const produtoModel = require('../../model/produtoModel');
const varianteModel = require('../../model/varianteModel')
const caregoriaModel = require('../../model/categoriaModel');


async function getDataHome(){
    return new Promise((resolve, reject) => {
        try {
            const data = {titulo: 'home'}
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataCadastroProduto(){
    return new Promise(async (resolve, reject) => {
        try {
            const categorias = await caregoriaModel.categorias()
            const data = {conteudo: './conteudo/cadastroProduto', titulo: 'Cadastro de Produto', categorias}
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
} 
async function getDataEdicaoVariante(req){
    return new Promise(async (resolve, reject) => {
        try {
            const id = parseInt(req.params.id);
            const variante = await varianteModel.getById(id);

    
            const data = {
                conteudo: './conteudo/edicaoVariante', 
                titulo: 'Edição de Variante',
                variante: variante[0],
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataEdicaoProduto(req){
    return new Promise(async (resolve, reject) => {
        try {
            const id = parseInt(req.params.id);
            const produto = await produtoModel.getById(id);
     
            const data = {
                conteudo: './conteudo/edicaoProduto', 
                titulo: 'Edição de Produto',
                produto: produto[0],

            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataListaProduto(req){
    return new Promise(async(resolve, reject) => {
        try {
            const produtos = await produtoModel.getbyOffset(0, 20)
            const data = {
                titulo: 'Lista de produtos',
                conteudo: './conteudo/listaProduto', 
                produtos: produtos
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataCategorias(){
    return new Promise(async (resolve, reject) => {
        try {
            const categorias = await caregoriaModel.categorias();
            const data = {
                titulo: 'Categorias',
                conteudo: './conteudo/categorias',
                categorias: categorias
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    home: async (req, res) => {
        const data = await getDataHome();
        res.render('admin/layout', data);
    },
    cadastroVariante: async (req, res) => {
        const data = {conteudo: './conteudo/cadastroVariante', titulo: 'Cadastro de Variante'}
        res.render('admin/layout', data);
    },
    cadastroProduto: async (req, res) => {
        const data = await getDataCadastroProduto();
        res.render('admin/layout', data);
    },
    edicaoVariante: async (req, res) => {
        const data = await getDataEdicaoVariante(req);
        res.render('admin/layout', data)
    },
    edicaoProduto: async (req, res) => {
        const data = await getDataEdicaoProduto(req);
        res.render('admin/layout', data)
    },
    listaProduto: async (req, res) => {
        const data = await getDataListaProduto(req)
        res.render('admin/layout', data)
    },
    listaVariante: async (req, res) => {

        const id = req.params.id
        const variantes = await varianteModel.getByProdutoId(id)
        const data = {
            titulo: 'Lista de variantes ',
            conteudo: './conteudo/listaVariante', 
            variantes: variantes,
            produto_id: id
        }
        res.render('admin/layout', data)
    },
    categorias: async (req, res) => {
       const data = await getDataCategorias();
        res.render('admin/layout', data)
    }
}
const produtoModel = require('../../model/produto.model');
const varianteModel = require('../../model/variante.model');
const caregoriaModel = require('../../model/categoria.model');

async function getDataHome(){
    return new Promise((resolve, reject) => {
        try {
            const data = {
                titulo: 'home'
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataCadastroProduto(){
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const categorias = await caregoriaModel.getAll()
                const data = {conteudo: './conteudo/cadastroProduto', titulo: 'Cadastro de Produto', categorias}
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })()
    })
} 
async function getDataEdicaoVariante(req){
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const id = parseInt(req.params.id);
                const variante = await varianteModel.getById(id);
                const categorias = await caregoriaModel.getAll()
        
                const data = {
                    conteudo: './conteudo/edicaoVariante', 
                    titulo: 'Edição de Variante',
                    variante: variante[0],
                    categorias: categorias
                }
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })()
    })
}
async function getDataEdicaoProduto(req){
    return new Promise((resolve, reject) => {
        (async ()=>{
            try {
                const id = parseInt(req.params.id);
                const produto = await produtoModel.getByIdWithCategoria(id);
                const categorias = await caregoriaModel.getAll()
         
                const data = {
                    conteudo: './conteudo/edicaoProduto', 
                    titulo: 'Edição de Produto',
                    produto: produto[0],
                    categorias: categorias
    
                }
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })()
    })
}
async function getDataListaProduto(){
    return new Promise((resolve, reject) => {
       (async ()=>{
        try {
            const produtos = await produtoModel.getbyOffsetAll(0, 20)
            const data = {
                titulo: 'Lista de produtos',
                conteudo: './conteudo/listaProduto', 
                produtos: produtos
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
       })()
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
        const produto = await produtoModel.getById(id)
        const data = {
            titulo: 'Lista de variantes ',
            conteudo: './conteudo/listaVariante', 
            variantes: variantes,
            produto_id: id,
            produto
        }
        res.render('admin/layout', data)
    },
    categorias: async (req, res) => {
        try {
            const categorias = await caregoriaModel.getAll()
            console.log(categorias)
            const data = {
                titulo: 'Categorias',
                conteudo: './conteudo/categorias',
                categorias: categorias
            }
            res.render('admin/layout', data)
        } catch (error) {
            console.log(error)
            res.render('500')
        }
    }
}
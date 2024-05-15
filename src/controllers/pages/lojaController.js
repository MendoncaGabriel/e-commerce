const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 15  }); // TTL de 15 minutos

const produtoModel = require('../../model/produtoModel');
const empresaModel = require('../../model/empresaModel');
const categoriaModel = require('../../model/categoriaModel');
const usuarioModel = require('../../model/usuarioModel');

async function getDataHome(req){
    return new Promise( async(resolve, reject) => {
        try {
            const produtos = await produtoModel.listaProdutos(1);
            const categorias = await categoriaModel.categorias();
            const dadosEmpresa = await empresaModel.dados();
            const enderecosEmpresa = await empresaModel.enderecos();
            const banners = await empresaModel.bannerHome();
            const redesSociais = await empresaModel.redesSociais();
            const logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;

            const  produtosFiltrados = produtos.filter((e)=>{
                return e.ativo == 1 && e.imagem !== null && e.estoque > 0 ;
            });  
            
            const data = {
                logado:logado,
                banners: banners,
                categorias: categorias,
                redesSociais: redesSociais,
                dadosEmpresa: dadosEmpresa,
                carrosel_1_titulo: 'Novidades', 
                carrosel_1_data: produtosFiltrados, 
                enderecosEmpresa: enderecosEmpresa,
                tituloCategoria: 'Todos os produtos',
            };
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}
async function getDataProduto(req){
    return new Promise(async (resolve, reject) => {
        try {
            const logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
            const nome = req.params.nome;
            const produto = await produtoModel.produtoComVariantes(nome);
            const redesSociais = await empresaModel.redesSociais();
            const dadosEmpresa = await empresaModel.dados();
            const enderecosEmpresa = await empresaModel.enderecos();

            const data = {
                produto, 
                dadosEmpresa, 
                logado:logado,
                redesSociais: redesSociais,
                enderecosEmpresa: enderecosEmpresa,
                nomeProduto: nome.toUpperCase().replace(/-/g, ' ')
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataCheckout(req){
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.cookies.token;
            if(!token) throw new Error('Token em cookie não encontrado');

            const carrinhoCookie = JSON.parse(req.cookies.carrinho);
            if(!carrinhoCookie) throw new Error("sem carrinho em cookies");

            const carrinhoProcessado = await produtoModel.processarCheckOut(carrinhoCookie);
            const endereco = await usuarioModel.pegarEnderecoUsuario(token);
            const metodosEntrega = await empresaModel.metodosEntrega();
         
            if(!carrinhoProcessado) throw new Error("carrinho processado e undefined ou []");
            if(!endereco) throw new Error('Endereço do usuario não definido');
            if(!metodosEntrega) throw new Error('Metodos de entrega não definidos');

            const data = {carrinhoProcessado, endereco, carrinhoProcessado, metodosEntrega};
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataCriarConta(){
    return new Promise( async (resolve, reject) => {
        try {
            const bannerAuth = await empresaModel.bannerAuth()
            const data = {banners: bannerAuth}
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataEntrar(){
    return new Promise( async (resolve, reject) => {
        try {
            const dadosEmpresa = await empresaModel.bannerAuth()
            const data = {banners: dadosEmpresa}
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
async function getDataGridProdutos(req){
    return new Promise( async (resolve, reject) => {
        try {
            const titulo = req.params.categoria;
            const dadosEmpresa = await empresaModel.dados();
            const categorias = await categoriaModel.categorias();

            let produtosCategoria = [];
            if (titulo == 'todos-os-produtos') {
                produtosCategoria = await produtoModel.getProdutosbyOffset(20, 1);
            } else {
                produtosCategoria = await produtoModel.getProdutosCategoria(titulo);
            };
            const data = {
                titulo: titulo,
                carrosel_1_titulo: 'Novidades', 
                categorias: categorias,
                dadosEmpresa: dadosEmpresa,
                produtosCategoria: produtosCategoria,
                tituloCategoria: titulo
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    home: async (req, res) => {
        try {
            let data = cache.get("homeData");
            if (!data) {
                data = await getDataHome(req);
                cache.set("homeData", data);
            }

            res.render('loja/home', data);
        } catch (error) {
            console.log(error)
            res.redirect('/erro')
        }
    },
    produto: async (req, res) => {
        try {
            let data = cache.get("produtoData");
            if (!data) {
                data = await getDataProduto(req)
                cache.set("produtoData", data);
            }
            res.render('loja/produto', data)
        } catch (error) {
            console.log(error)
            res.redirect('/erro')
        }
    },
    checkout: async (req, res) => {
        try {
            let data = cache.get("checkoutData");
            if (!data) {
                data = await getDataCheckout(req)
                cache.set("checkoutData", data);
            }
            res.render('loja/checkout', data )
               
        } catch (error) {
            console.log(error)
            res.redirect('/erro')
        }
    },
    criarConta: async (req, res) => {
        try{
            let data = cache.get("criarContaData");
            if (!data) {
                data = await getDataCriarConta();
                cache.set("criarContaData", data);
            }
            res.render('loja/criarConta', data);
        }catch(error){
            console.log(error)
            res.redirect('/erro')
        }
    },
    entrar: async (req, res) => {
        try{
            let data = cache.get("entrarData");
            if (!data) {
                data = await getDataEntrar();
                cache.set("entrarData", data);
            }
            res.render('loja/entrar', data)
        }catch(error){
            console.log(error)
            res.redirect('/erro')
        }
    },
    gridProdutos: async (req, res) => {
        try {
            let data = cache.get("gridProdutosData");
            if (!data) {
                data = await getDataGridProdutos(req)
                cache.set("gridProdutosData", data);
            }
            res.render('loja/gridProdutos', data);
        } catch (error) {
            console.log(error)
            res.redirect('/erro')
        }
    },
    error: (req, res) =>{
        try {
            res.render('500')
        } catch (error) {
            console.log(error)
        }
    }
}
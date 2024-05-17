const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 15  }); // TTL de 15 minutos
const jwt = require('jsonwebtoken');
require('dotenv').config();

const produtoModel = require('../../model/produtoModel');
const empresaModel = require('../../model/empresaModel');
const usuarioModel = require('../../model/usuarioModel');
const checkoutModel = require('../../model/checkoutModel');
const categoriaModel = require('../../model/categoriaModel');

async function getDataHome(req){
    return new Promise( async(resolve, reject) => {
        try {
            const produtos = await produtoModel.getbyOffset(0, 10);
            const categorias = await categoriaModel.categorias();
            const dadosEmpresa = await empresaModel.dados();
            const enderecosEmpresa = await empresaModel.enderecos();
            const banners = await empresaModel.bannerHome();
            const redesSociais = await empresaModel.redesSociais();
            

            const  produtosFiltrados = produtos.filter((e)=>{
                return e.ativo == 1 && e.imagem !== null && e.estoque > 0 ;
            });  
            
            const data = {
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
            const produto = await produtoModel.getProdutoWithVariantes(nome);
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

            const usuario = jwt.verify(token, process.env.ASSINATURA_TOKEN)
            const idusuarios = usuario.idusuario;
           

            const carrinhoCookie = JSON.parse(req.cookies.carrinho);
            if(!carrinhoCookie) throw new Error("sem carrinho em cookies");

            const carrinhoProcessado = await checkoutModel.processCheckout(carrinhoCookie);
            const endereco = await usuarioModel.getEndereco(idusuarios) || [];
   
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
async function getDataCategorias(req){
    return new Promise( async (resolve, reject) => {
        try {
            const titulo = req.params.categoria;
            const dadosEmpresa = await empresaModel.dados();
            const categorias = await categoriaModel.categorias();

            let produtosCategoria = [];
            if (titulo == 'todos-os-produtos') {
                produtosCategoria = await produtoModel.getProdutosbyOffset(20, 1);
            } else {
                produtosCategoria = await produtoModel.getByCategoria(titulo);
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
            data.logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
            res.render('loja/home', data);
        } catch (error) {
            console.log(error)
            res.redirect('/erro')
        }
    },
    produto: async (req, res) => {
        try {
            const produto = req.params.nome;
            let data = cache.get("produtoData" + produto);
            if (!data) {
                data = await getDataProduto(req)
                cache.set("produtoData" + produto, data);
            }
            res.render('loja/produto', data)
        } catch (error) {
            console.log(error)
            res.redirect('/erro')
        }
    },
    checkout: async (req, res) => {
        try {
            const  data = await getDataCheckout(req)
            res.render('loja/checkout', data )
               
        } catch (error) {
            console.log(error)
            res.redirect('/erro')
        }
    },
    criarConta: async (req, res) => {
        try{
            let data = await  getDataCriarConta();
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
    categorias: async (req, res) => {
        try {
            const categoria = req.params.categoria
            let data = cache.get("categorias" + categoria);
            if (!data) {
                data = await getDataCategorias(req)
                cache.set("categorias" + categoria, data);
            }
            res.render('loja/categorias', data);
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
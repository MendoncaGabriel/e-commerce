const jwt = require('jsonwebtoken');
require('dotenv').config();

const produtoModel = require('../../model/produtoModel');
const varianteModel = require('../../model/varianteModel');
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
            
            // Separar em grupos por categorias
            const carroselProdutos = [];
            produtos.forEach(produto => {
              let categoriaExistente = carroselProdutos.find(categoria => categoria.titulo === produto.categoria);
            
              if (categoriaExistente) {
                categoriaExistente.data.push(produto);
              } else {
                carroselProdutos.push({
                  titulo: produto.categoria,
                  data: [produto]
                });
              }
            });
            
            const data = {
                banners: banners,
                categorias: categorias,
                redesSociais: redesSociais,
                dadosEmpresa: dadosEmpresa,
                enderecosEmpresa: enderecosEmpresa,
                carroselProdutos: carroselProdutos
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
            const produto = await produtoModel.getByName(nome)
            const variantes = await varianteModel.getByProdutoId(produto[0].produto_id)
      
            const redesSociais = await empresaModel.redesSociais();
            const dadosEmpresa = await empresaModel.dados();
            const enderecosEmpresa = await empresaModel.enderecos();

            const data = {
                produto,
                variantes,
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
            const titulo = req.params.categoria.replace(/-/g, ' ');
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
            let data = await getDataHome(req);
            data.logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
            res.render('loja/home', data)
        } catch (error) {
            console.log(error);
            res.redirect('/erro');
        }
    },
    produto: async (req, res) => {
        try {
            let data = await getDataProduto(req)
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
            let data = await getDataEntrar();
            res.render('loja/entrar', data)
        }catch(error){
            console.log(error)
            res.redirect('/erro')
        }
    },
    categorias: async (req, res) => {
        try {
            let data = await getDataCategorias(req)
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
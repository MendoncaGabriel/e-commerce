const jwt = require('jsonwebtoken');
const produtoModel = require('../../model/produto.model');
const empresaModel = require('../../model/empresa.model');
const usuarioModel = require('../../model/usuario.model');
const varianteModel = require('../../model/variante.model');
const checkoutModel = require('../../model/checkout.model');
const categoriaModel = require('../../model/categoria.model');
const bannerModel = require('../../model/banner.model');
const redesSociais = require('../../model/redesSociais.loja.model');
const carroselModel = require('../../model/carrosel.model');
const lojaModel = require('../../model/loja.model')
const enderecoLoja = require('../../model/endereco.loja.model')
const paletaCores = require('../..//model/paleta.cores');

async function getCarrosel() {
    const categorias = await categoriaModel.getAll()
    const carrosel = []
    for (const categoria of categorias) {
        const produtos = await produtoModel.getByCategoria(categoria.nome_categoria);
        carrosel.push({
            titulo: categoria.nome_categoria,
            produtos: produtos
        });
    }
    return carrosel;
};
async function getDataProduto(req) {
    const logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
    const nome = req.params.nome;
    const produto = await produtoModel.getByName(nome);
    const variantes = await varianteModel.getByProdutoId(produto[0].produto_id);
    const redesSociais = await empresaModel.redesSociais();
    const dadosEmpresa = await empresaModel.dados();
    const enderecosEmpresa = await empresaModel.enderecos();

    const data = {
        produto,
        variantes,
        dadosEmpresa,
        logado,
        redesSociais,
        enderecosEmpresa,
        nomeProduto: nome.toUpperCase().replace(/-/g, ' ')
    };

    return data;
};
async function getDataCheckout(req) {
    const token = req.cookies.token;
    if (!token) throw new Error('Token em cookie não encontrado');

    const usuario = jwt.verify(token, process.env.ASSINATURA_TOKEN);
    const idusuarios = usuario.idusuario;

    const carrinhoCookie = JSON.parse(req.cookies.carrinho);
    if (!carrinhoCookie) throw new Error("Sem carrinho em cookies");

    const carrinhoProcessado = await checkoutModel.processCheckout(carrinhoCookie);
    const endereco = await usuarioModel.getEndereco(idusuarios) || [];

    const metodosEntrega = await empresaModel.metodosEntrega();
    if (!carrinhoProcessado) throw new Error("Carrinho processado é undefined ou []");
    if (!endereco) throw new Error('Endereço do usuário não definido');
    if (!metodosEntrega) throw new Error('Métodos de entrega não definidos');

    // ferramentas
    const { stringParaReal } = require('../../views/loja/components/checkout/utilities')

    return { carrinhoProcessado, endereco, metodosEntrega, stringParaReal };
};
async function getDataCriarConta() {
    const bannerAuth = await empresaModel.bannerAuth();
    const data = { banners: bannerAuth };
    return data;
};
async function getDataEntrar() {
    const dadosEmpresa = await empresaModel.bannerAuth();
    const data = { banners: dadosEmpresa };
    return data;
};
async function getDataCategorias(req) {
    const titulo = req.params.categoria.replace(/-/g, ' ');
    const dadosEmpresa = await empresaModel.dados();
    const categorias = await categoriaModel.getAll();

    let produtosCategoria = [];
    if (titulo === 'todos-os-produtos') {
        produtosCategoria = await produtoModel.getProdutosbyOffset(20, 1);
    } else {
        produtosCategoria = await produtoModel.getByCategoria(titulo);
    }

    const data = {
        titulo: titulo,
        categorias: categorias,
        dadosEmpresa: dadosEmpresa,
        produtosCategoria: produtosCategoria,
        tituloCategoria: titulo
    };

    return data;
};

const loja_id = process.env.LOJA_ID;

exports.home = async (req, res) => {
    try {
        const carrosel = await carroselModel.getAll(loja_id);
        const categoria = await categoriaModel.getAll(loja_id);
        const loja = await lojaModel.getById(loja_id);
        const banners = await bannerModel.getAll("home", loja_id);
        const redes = await redesSociais.getAll(loja_id);
        const endereco = await enderecoLoja.getAll(loja_id);
        const cores = await paletaCores.getByLojaId(loja_id)
        console.log(cores)
       
        let data = {
            banners: banners,
            paleta: cores,
            loja: loja, 
            categorias: categoria,
            redesSociais: redes, 
            enderecosLoja: endereco, 
            carroselProdutos: [] 
        };

        //carroselProdutos
        for(let e of carrosel){
            data.carroselProdutos.push({
                titulo: e.nome, 
                nome_categoria: e.nome,
                produtos: await produtoModel.getbyOffset(0, 20, loja_id, e.nome) 
            })
        }
    
        res.render('loja/home', data); 
    } catch (error) {
        console.error(error);
        res.redirect('/erro'); 
    }
};
exports.produto = async (req, res) => {
    try {
        let data = await getDataProduto(req)
        res.render('loja/produto', data)
    } catch (error) {
        console.log(error)
        res.redirect('/erro')
    }
};
exports.checkout = async (req, res) => {
    try {
        const  data = await getDataCheckout(req)

        res.render('loja/checkout', data )
    } catch (error) {
        console.log(error)
        res.redirect('/erro')
    }
};
exports.criarConta = async (req, res) => {
    try{
        let data = await  getDataCriarConta();
        res.render('loja/criarConta', data);
    }catch(error){
        console.log(error)
        res.redirect('/erro')
    }
};
exports.entrar = async (req, res) => {
    try{
        let data = await getDataEntrar();
        res.render('loja/entrar', data)
    }catch(error){
        console.log(error)
        res.redirect('/erro')
    }
};
exports.categorias = async (req, res) => {
    try {
        let data = await getDataCategorias(req)
        res.render('loja/categorias', data);
    } catch (error) {
        console.log(error)
        res.redirect('/erro')
    }
};
exports.meusPedidos = async (req, res) => {
    try {
        const dadosProdutos = [
            {
                produto: "Produto 1",
                status: true,
                preco: "R$ 10,00",
                quantidade: 2,
                total: "R$ 20,00",
                data: "01/06/2024"
            },
            {
                produto: "Produto 2",
                status: true,
                preco: "R$ 15,00",
                quantidade: 1,
                total: "R$ 15,00",
                data: "02/06/2024"
            },
            {
                produto: "Produto 3",
                status: true,
                preco: "R$ 20,00",
                quantidade: 3,
                total: "R$ 60,00",
                data: "03/06/2024"
            },
            {
                produto: "Produto 4",
                status: false,
                preco: "R$ 5,00",
                quantidade: 5,
                total: "R$ 25,00",
                data: "04/06/2024"
            },
            {
                produto: "Produto 5",
                status: false,
                preco: "R$ 12,00",
                quantidade: 2,
                total: "R$ 24,00",
                data: "05/06/2024"
            }
        ]
        res.render('loja/meusPedidos', {dadosProdutos});
    } catch (error) {
        console.log(error)
        res.redirect('/erro')
    }
};
exports.error = (req, res) => {
    try {
        res.render('500')
    } catch (error) {
        console.log(error)
    }
};
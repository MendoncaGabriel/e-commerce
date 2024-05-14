const produtoModel = require('../../model/produtoModel');
const empresaModel = require('../../model/empresaModel');
const categoriaModel = require('../../model/categoriaModel');
const usuarioModel = require('../../model/usuarioModel');


module.exports = {
    home: async (req, res) => {
    
        try {
            const logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
            const produtos = await produtoModel.listaProdutos(1);
            const categorias = await categoriaModel.categorias();
            const dadosEmpresa = await empresaModel.dados();
            const enderecosEmpresa = await empresaModel.enderecos();
            const banners = await empresaModel.bannerHome();
            const redesSociais = await empresaModel.redesSociais();
      
 

            // Filtro
            const  produtosFiltrados = produtos.filter((e)=>{
               return e.ativo == 1 && e.imagem !== null && e.estoque > 0 ;
            });  
           
            const data = {
                tituloCategoria: 'Todos os produtos',
                carrosel_1_data: produtosFiltrados, 
                carrosel_1_titulo: 'Novidades', 
                dadosEmpresa: dadosEmpresa,
                categorias: categorias,
                banners: banners,
                logado:logado,
                enderecosEmpresa: enderecosEmpresa,
                redesSociais: redesSociais
            };
            res.render('loja/home', data);
        } catch (error) {
            console.log(error);
        }
    },
    produto: async (req, res) => {
        try {
            const logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
            const nome = req.params.nome;
            const produto = await produtoModel.produtoComVariantes(nome);
            const redesSociais = await empresaModel.redesSociais();
            const dadosEmpresa = await empresaModel.dados();
            const enderecosEmpresa = await empresaModel.enderecos();


            res.render('loja/produto', {
                produto, 
                dadosEmpresa, 
                nomeProduto: nome.toUpperCase().replace(/-/g, ' '),
                logado:logado,
                redesSociais: redesSociais,
                enderecosEmpresa: enderecosEmpresa
            })
        } catch (error) {
            console.log(error)
        }
    },
    checkout: async (req, res) => {
        try {
            const token = req.cookies.token;
            const carrinhoCookie = JSON.parse(req.cookies.carrinho);
            if(!carrinhoCookie) throw new Error("sem carrinho em cookies");

            const carrinhoProcessado = await produtoModel.processarCheckOut(carrinhoCookie);
            const endereco = await usuarioModel.pegarEnderecoUsuario(token);
            const metodosEntrega = await empresaModel.metodosEntrega();
         
            // if(!carrinhoProcessado) throw new Error("carrinho processado e undefined ou []");
            // if(!endereco) throw new Error('Endereço do usuario não definido');
            // if(!metodosEntrega) throw new Error('Metodos de entrega não definidos');


            const data = {carrinhoProcessado, endereco, carrinhoProcessado, metodosEntrega};

            res.render('loja/checkout', data )
               
        } catch (error) {
            console.log(error)
        }
    },
    criarConta: async (req, res) => {
        try{
            const dadosEmpresa = await empresaModel.bannerAuth()
            res.render('loja/criarConta', {banners: dadosEmpresa})
        }catch(error){
            console.log(error)
        }
    },
    entrar: async (req, res) => {
        try{
            const dadosEmpresa = await empresaModel.bannerAuth()
            res.render('loja/entrar', {banners: dadosEmpresa})
        }catch(error){
            console.log(error)
        }
    },
    gridProdutos: async (req, res) => {
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
            console.log(produtosCategoria)

            res.render('loja/gridProdutos', {
                titulo: titulo,
                carrosel_1_titulo: 'Novidades', 
                categorias: categorias,
                dadosEmpresa: dadosEmpresa,
                produtosCategoria: produtosCategoria,
                tituloCategoria: titulo
            });

        } catch (error) {
            console.log(error);
        }
    }
}
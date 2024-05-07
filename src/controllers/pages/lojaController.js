const produtoModel = require('../../model/produtoModel');
const empresaModel = require('../../model/empresaModel');
const categoriaModel = require('../../model/categoriaModel');

module.exports = {
    home: async (req, res) => {
    
        try {
            const logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
            const produtos = await produtoModel.listaProdutos(1);
            const dadosEmpresa = await empresaModel.dados();
            const banners = await empresaModel.bannerHome();
            console.log(banners.length)
      
            // Filtrar produtos a serem enviados
            const  produtosFiltrados = produtos.filter((e)=>{
               return e.ativo == 1 && e.imagem !== null && e.estoque > 0 ;
            });
           
     
            const categorias = await categoriaModel.categorias();
            res.render('loja/home', {
                carrosel_1_titulo: 'Novidades', 
                carrosel_1_data: produtosFiltrados, 
                categorias: categorias,
                dadosEmpresa: dadosEmpresa,
                banners: banners,
                tituloCategoria: 'Todos os produtos',
                logado:logado
            });
        } catch (error) {
            console.log(error);
        }
    },
    produto: async (req, res) => {
        try {
            const logado = req.cookies.token && req.cookies.token.length > 0 ? true : false;
            const nome = req.params.nome;
            const produto = await produtoModel.produtoComVariantes(nome);
            const dadosEmpresa = await empresaModel.dados()

            res.render('loja/produto', {
                produto, 
                dadosEmpresa, 
                nomeProduto: nome.toUpperCase().replace(/-/g, ' '),
                logado:logado
            })
        } catch (error) {
            console.log(error)
        }
    },
    checkout: async (req, res) => {
        try {
            const carrinhoCookie = JSON.parse(req.cookies.carrinho);
            const carrinhoProcessado = await produtoModel.processarCheckOut(carrinhoCookie);

        
            let endereco = {};
            try{
                endereco = await usuarioModel.pegarEnderecoUsuario(req.cookies.token);
            } catch (error) {
                console.log('Endereço do usuario não definido');
            };

            console.log('===> carrinhoProcessado: ', carrinhoProcessado)
            res.render('loja/checkout', {carrinhoProcessado, endereco, carrinhoProcessado})
               
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
            const categoria = req.params.categoria;
            const titulo = capitalizar(categoria);

            const dadosEmpresa = await empresaModel.dados();
            const categorias = await categoriaModel.categorias();

            //buscar produtos por categorias

            let produtosCategoria = [];
            if (categoria == 'todos-os-produtos') {
                produtosCategoria = await produtoModel.getProdutosbyOffset(20, 1);
            } else {
                produtosCategoria = await produtoModel.getProdutosCategoria(categoria);
            }

            res.render('loja/gridProdutos', {
                titulo: titulo,
                carrosel_1_titulo: 'Novidades', 
                categorias: categorias,
                dadosEmpresa: dadosEmpresa,
                produtosCategoria: produtosCategoria,
                tituloCategoria: categoria

            });

        } catch (error) {
            console.log(error);
        }
    }
}
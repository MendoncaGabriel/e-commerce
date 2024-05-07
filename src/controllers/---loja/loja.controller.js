const produtoModel = require('../../model/produto.model');
const categoriaModel = require('../../model/categoria.model');
const empresa = require('../../model/config.model');
const usuarioModel = require('../../model/usuario.model');

const { capitalizar } = require('../../utilities/text');

module.exports = {
    home: async (req, res) => {
        try {
            const produtos = await produtoModel.listaProdutos(1);
         
            const dadosEmpresa = await empresa.dados();
            const banners = await empresa.banners();
      
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
                tituloCategoria: 'Todos os produtos'
            });
        } catch (error) {
            console.log(error)
        }
    },
    produto: async (req, res) => {
        try {
            const nome = req.params.nome
            const produto = await produtoModel.produtoComVariantes(nome)
            const dadosEmpresa = await empresa.dados()

            res.render('loja/produto', {produto, dadosEmpresa, nomeProduto: nome.toUpperCase().replace(/-/g, ' ')})
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
            const dadosEmpresa = await empresa.bannerForm()
            res.render('loja/criarConta', {banners: dadosEmpresa})
        }catch(error){
            console.log(error)
        }
    },
    entar: async (req, res) => {
        try{
            const dadosEmpresa = await empresa.bannerForm()
            res.render('loja/entrar', {banners: dadosEmpresa})
        }catch(error){
            console.log(error)
        }
    },
    gridProdutos: async (req, res) => {
        try {
            const categoria = req.params.categoria;
            const titulo = capitalizar(categoria);

            const dadosEmpresa = await empresa.dados();
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
};
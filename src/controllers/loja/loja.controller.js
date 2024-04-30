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
      
            // Filtrar produtos a serem enviados
            const  produtosFiltrados = produtos.filter((e)=>{
               return e.ativo == 1 && e.imagem !== null && e.estoque > 0 ;
            });


            const categorias = await categoriaModel.categorias();
            res.render('loja/home', {
                carrosel_1_titulo: 'Novidades', 
                carrosel_1_data: produtosFiltrados, 
                categorias: categorias,
                dadosEmpresa: dadosEmpresa
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

            res.render('loja/produto', {produto, dadosEmpresa})
        } catch (error) {
            console.log(error)
        }
    },
    checkout: async (req, res) => {
        try {
            const carrinho = JSON.parse(req.cookies.carrinho)
            const itensProcessados = await produtoModel.processarCheckOut(carrinho)
            const pedido = [];

            itensProcessados.itens.forEach(element => {
                pedido.push({
                    produto_id: element.produto_id, 
                    variante_id: element.variante_id, 
                    qtdProduto: element.qtdProduto
                });
            });
          
            const endereco = await usuarioModel.pegarEnderecoUsuario(req.cookies.token)
               
            res.render('loja/checkout', {itensProcessados, endereco, pedido})
        } catch (error) {
            console.log(error)
        }
    },
    criarConta: async (req, res) => {
        try{
           res.render('loja/criarConta')
        }catch(error){
            console.log(error)
        }
    },
    gridProdutos: async (req, res) => {
        try {
            const categoria = req.params.produtos;
            const titulo = capitalizar(categoria);
            const dadosEmpresa = await empresa.dados();
            const categorias = await categoriaModel.categorias();

            //buscar produtos por categorias
            const produtosCategoria = await produtoModel.getProdutosCategoria(categoria);

            res.render('loja/gridProdutos', {
                titulo: titulo,
                carrosel_1_titulo: 'Novidades', 
                categorias: categorias,
                dadosEmpresa: dadosEmpresa,
                produtosCategoria: produtosCategoria
            });

        } catch (error) {
            console.log(error);
        }
    }
};
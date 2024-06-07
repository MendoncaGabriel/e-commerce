const Pedido = require('../model/pedidoModel');
const usuarioModel = require('../model/usuarioModel');
const produtoModel = require('../model/produtoModel');
const varianteModel = require('../model/varianteModel');

async function consultarProdutos(data){
    const produtos = [];
    let total = 0;

    for(const e of data){
        if(!e.variante_id || e.variante_id == null){
            // E um  produto
            const item = await produtoModel.getById(e.produto_id);
            item[0].qtd = e.qtd;
            item[0].total = item[0].preco * e.qtd;
            total += item[0].total;
            produtos.push(item[0]);
        }else{
            //E uma variante de produto
            const item = await varianteModel.getById(e.variante_id);
            item[0].qtd = e.qtd;
            item[0].total = item[0].preco * e.qtd;
            total += item[0].total;
            produtos.push(item[0])
        };
    };

    return {produtos, total};         
}

async function registrarPedido(usuario_id, carrinhoCookies){
    //Registrando pedidos do usuario
    const carrinho = await consultarProdutos(carrinhoCookies);
    for(const e of carrinho.produtos){
        if(!e.variante_id || e.variante_id == null){
            //E um produto
            const pedido = new Pedido(usuario_id, e.produto_id, e.variante_id || null, e.qtd, e.preco, 'produto', "AGUARDANDO CONFIRMAÇÃO");
            pedido.createPedido();
            decrementarEstoque(e.produto_id, e.variante_id, e.qtd);
            
        }else{
            //E a variante de um produto
            const pedido = new Pedido(usuario_id, e.produto_id, e.variante_id || null, e.qtd, e.preco, 'variante', "AGUARDANDO CONFIRMAÇÃO");
            pedido.createPedido();
            decrementarEstoque(e.produto_id, e.variante_id, e.qtd);
        }
    }
}

async function decrementarEstoque(produto_id, variante_id, qtd){
    if(!variante_id || variante_id == null){
        //E um produto
        await produtoModel.updateStock(produto_id, qtd);
        
    }else{
        //E a variante de um produto
        await varianteModel.updateStock(variante_id, qtd);
    };
};


module.exports = {
    createPedido: async (req, res) => {
        try {
            const usuario_id = req.locals.idusuario;
            const carrinhoCookies = JSON.parse(req.cookies.carrinho);

            await registrarPedido(usuario_id, carrinhoCookies);

            //limpar carrinho

       


            res.status(200).json({msg: "Pedido registrado com sucesso!"})
        } catch (error) {
            res.status(500).json({msg: "Erro interno no servidor", error})
        }
    
    }
}
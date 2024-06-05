const db = require('../../database/database');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const userModel = require('../model/usuarioModel')

async function getUser(userToken){
    const idusuario = jwt.verify(userToken, process.env.ASSINATURA_TOKEN).idusuario
    const user = await userModel.getById(idusuario)
    return user
}

function savePedidoProduto(status_pedido, data_pedido, usuarios_idusuarios){
    const pedido = {
        status: status_pedido,
        produto_id: produto_id,
        qtd: qtd,
        total: total,
        preco: preco
    }
    const sql = "INSERT INTO pedidos (status_pedido, data_pedido, usuarios_idusuarios) VALUES (?, ?, ?, ?);";
    const values = [status_pedido, data_pedido, usuarios_idusuarios]
    console.log(pedido)
}

function savePedidoVariante(status, produto_id, variante_id, qtd, total, preco){
    const pedido = {
        status: status,
        produto_id: produto_id,
        variante_id: variante_id,
        status: status,
        qtd: qtd,
        total: total,
        preco: preco
    }
    console.log(pedido)
}

module.exports = {
    createPedido: async (status, carrinho, userToken) => {

        for(produto of carrinho){
            if(typeof produto.variante_id != "undefined" && produto.variante_id){
                //É uma variante
                savePedidoProduto(false, produto_id, variante_id, qtd, total, preco)
            }else{
                //É um produto
                savePedidoProduto(false, produto_id, qtd, total, preco)
            }

            savePedido(false, produto.produto_id)
        }
    
    }
}
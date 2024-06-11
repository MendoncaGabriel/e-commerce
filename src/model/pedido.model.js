const Pedido = require('../../database/schemas/pedido.schema');

exports.createPedido = async (usuario_id, produto_id, variante_id, qtd, preco, tipo, status) => {
    try {
        return await Pedido.create({
            status_pedido: status,
            tipo: tipo,
            produto_id: produto_id,
            variante_id: variante_id,
            usuario_id: usuario_id,
            qtd: qtd,
            total: total,
            preco: preco
        });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
}


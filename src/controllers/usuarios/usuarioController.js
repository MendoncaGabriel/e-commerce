const usuarioModel = require('../../model/usuarioModel');

module.exports = {
    // atualizar ou inserir endereço
    endereco: async (req, res) => {
        try {
            const tokenUsuario = req.cookies.token;
            const {rua, numero, bairro, cidade, estado, referencia, telefone} = req.body;
            const enderecoUsuario = await  usuarioModel.atualizarendereco(rua, numero, bairro, cidade, estado, referencia, telefone, tokenUsuario);
            res.status(200).json(enderecoUsuario);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        };
    },

    // registrar pedido
    pedido: async (req, res) => {
        try {
            const tokenUsuario = req.cookies.token;
            const pedido = req.body;
            console.log('===> pedido: ', pedido)
            
            
            const result = await usuarioModel.registarPedido(pedido, tokenUsuario)
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
};
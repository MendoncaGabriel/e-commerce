const usuarioModel = require('../../model/usuarioModel');
const jwt = require('jsonwebtoken')
require('dotenv').config();
module.exports = {
    getEndereco: async (req, res) => {
        console.log('pedido para atualizar')
        try {
            const tokenUsuario = req.cookies.token;
            const {idusuario} = jwt.verify(tokenUsuario, process.env.ASSINATURA_TOKEN)



            const enderecoUsuario = await  usuarioModel.getEndereco(idusuario);

           
            res.status(200).json(enderecoUsuario);
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: error.message});
        };
    },
    updateEndereco: async (req, res) => {
        try {
            const tokenUsuario = req.cookies.token;
            const {idusuario} = jwt.verify(tokenUsuario, process.env.ASSINATURA_TOKEN)

            const {rua, bairro, cep, cidade, estado, pais, numero_casa, referencia, telefone} = req.body
            await  usuarioModel.updateEndereco(rua, bairro, cep, cidade, estado, pais, numero_casa, referencia, telefone, idusuario);

            res.status(200).json({msg: 'Endereço atualizado com sucesso!'});
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: error.message});
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
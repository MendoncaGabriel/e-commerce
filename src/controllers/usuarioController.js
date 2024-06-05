const usuarioModel = require('../model/usuarioModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    getEndereco: async (req, res) => {
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


            const data = req.body
            await  usuarioModel.updateEndereco(data, idusuario);

            res.status(200).json({msg: 'Endereço atualizado com sucesso!'});
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: error.message});
        };
    },
    pedido: async (req, res) => {
        try {
            const tokenUsuario = req.cookies.token;
            const pedido = req.body;
            await usuarioModel.registarPedido(pedido, tokenUsuario)
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
};
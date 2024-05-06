const usuarioModel = require('../../model/usuario.model');

module.exports = {
    novoUsuario: async (req, res) => {
        try {
            const {nome, email, senha, telefone} = req.body;
            const usuario = await usuarioModel.novoUsuario(nome, email, senha, telefone);
            if(usuario){
                // Configurar o cookie para armazenar o token
                res.cookie('token', usuario.token, { 
                    maxAge: 30 * 24 * 60 * 60 * 1000, // Expira em 30 dias (em milissegundos)
                    httpOnly: true // O cookie só é acessível pelo servidor (não pelo JavaScript do lado do cliente)
                });


                res.status(200).json(usuario.msg);
            };
            
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        };
    },
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
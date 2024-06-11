const authModel = require('../model/auth.model');
const usuarioModel = require('../model/usuario.model');

module.exports = {
    login: async (req, res) => {
        try {
            const {email, senha} = req.body;
            const token = await authModel.login(email, senha);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 * 30, //30d
            });

            res.status(200).json({msg: "Usuario autenticado com sucesso!", token});
        } catch (error) {
            console.log(error)
            res.status(500).json(error.message);
        }
    },
    logout: (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ msg: "Logout realizado com sucesso." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao realizar logout." });
        }
    },
    signup: async (req, res) => {
        try {
            const {nome, email, senha, telefone} = req.body;
            const usuarioExist = await usuarioModel.usuarioExist(nome, email, senha, telefone);

            if(usuarioExist.length > 0) throw new Error("Usuário ja cadastrado!");
  

            const token = await authModel.signup(nome, email, senha, telefone);
       
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 * 30, //30d
            });

            res.status(200).json({msg: "Usuário registrado com sucesso"})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: error.message});
        }
    }
}
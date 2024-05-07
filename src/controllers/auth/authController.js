const authModel = require('../../model/authModel');

module.exports = {
    login: async (req, res) => {
        try {
            const {email, senha} = req.body;
            const token = await authModel.login(email, senha)
            
            res.status(200).json({msg: "Usuario autenticado com sucesso!", token})
            
        } catch (error) {
            console.log(error)
            res.status(500).json(error.message);
        }
    },
    signup: async (req, res) => {
        try {
            const {nome, email, senha, telefone} = req.body;
            if(!nome, !email, !senha, !telefone) throw new Error("Informações estão faltando para criar conta");

            const result = await authModel.signup(nome, email, senha, telefone)

            console.log(result)
            res.status(200).json({msg: "usuario registrado com sucesso"})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: error.message});
        }
    }
}
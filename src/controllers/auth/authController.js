const authModel = require('../../model/authModel');

module.exports = {
    login: async (req, res) => {
        try {
            const {email, senha} = req.body;
            console.log(email, senha);
            const token = await authModel.login(email, senha);

            // Configurar o cookie
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
            if(!nome, !email, !senha, !telefone) throw new Error("Informações estão faltando para criar conta");
            const {result, token} = await authModel.signup(nome, email, senha, telefone);
           
            // Configurar o cookie
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 * 30, //30d
            });

            res.status(200).json({msg: "usuario registrado com sucesso"})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: error.message});
        }
    }
}
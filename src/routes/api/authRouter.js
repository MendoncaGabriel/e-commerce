const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');

//MIDLLEWARES
const checkLogin = (req, res, next) => {
    try {
        const {email, senha} = req.body;
        if(!email) throw new Error('Email não foi passado em body');
        if(!senha) throw new Error('Eenha não foi passado em body');
        next()
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}
const checkSignup = (req, res, next) => {
    try {
        const {nome, email, senha, telefone} = req.body;
        if(!nome) throw new Error("Nome não foi passado no body");
        if(!email) throw new Error("Email não foi passado no body");
        if(!senha) throw new Error("Senha não foi passado no body");
        if(!telefone) throw new Error("Telefone não foi passado no body");
        next()
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

//ROTAS
router.post('/signup', checkSignup, authController.signup);
router.get('/login', checkLogin, authController.login);
router.get('/logout', authController.logout);

module.exports = router;
const express = require('express')
const router = express.Router()

const lojaController = require('../../controllers/loja/loja.controller')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class Utilitarios {
    static #chaveSecreta  = process.env.ASSINATURA_TOKEN;

    static verificarToken(token) {
        try {
            const decoded = jwt.verify(token, this.#chaveSecreta);
            return decoded;
        } catch (error) {
            console.error('Token inválido:', error.message);
            throw new Error('Token inválido');
        };
    };
};

  
router.get('/',  lojaController.home)
router.get('/produto/:nome',  lojaController.produto)
router.get('/criar-conta',  lojaController.criarConta)
router.get('/entrar',  lojaController.entar)
router.get('/categoria/:categoria',  lojaController.gridProdutos)

const verificarLogin = async (req, res, next) => {
    if(req.cookies.token){
        const teste = await Utilitarios.verificarToken(req.cookies.token)
        if(teste){
            next()
            return

        }else{
            return res.redirect('/criar-conta');
        }
        
    }
    res.redirect('/criar-conta');

}

router.get('/checkout', verificarLogin, lojaController.checkout)

module.exports = router
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/pages/loja.controller');
const cacheMiddleware = require('../../middlewares/cacheMiddleware ');


const checkAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) throw new Error('Sem token');

        const result = jwt.verify(token, process.env.ASSINATURA_TOKEN)
        if(!result || result == {}) throw new Error('Token invalido')

        next()
    } catch (error) {
        console.log(error)
        res.redirect('/criar-conta')
    }
}

router.get('/', pageController.home)
router.get('/error', pageController.error)
router.get('/entrar', cacheMiddleware, pageController.entrar)
router.get('/checkout', checkAuth, pageController.checkout)
router.get('/criar-conta', cacheMiddleware, pageController.criarConta)
router.get('/produto/:nome', pageController.produto)
router.get('/categoria/:categoria', cacheMiddleware, pageController.categorias)
router.get('/meus-pedidos', pageController.meusPedidos)

module.exports = router;
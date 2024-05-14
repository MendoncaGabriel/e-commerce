require('dotenv').config();
const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/pages/lojaController');

// verificar login
const checkAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) throw new Error('Sem token');
        
        next()
        
    } catch (error) {
        res.redirect('/criar-conta')
    }
}

router.get('/', pageController.home)
router.get('/entrar', pageController.entrar)
router.get('/checkout', checkAuth, pageController.checkout)
router.get('/criar-conta', pageController.criarConta)
router.get('/produto/:nome', pageController.produto)
router.get('/categoria/:categoria', pageController.gridProdutos)

module.exports = router
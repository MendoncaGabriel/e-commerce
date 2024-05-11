require('dotenv').config();
const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/pages/lojaController');


router.get('/', pageController.home)
router.get('/entrar', pageController.entrar)
router.get('/checkout', pageController.checkout)
router.get('/criar-conta', pageController.criarConta)
router.get('/produto/:nome', pageController.produto)
router.get('/categoria/:categoria', pageController.gridProdutos)

module.exports = router
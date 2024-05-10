require('dotenv').config();
const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/pages/lojaController');


router.get('/',  pageController.home)
router.get('/produto/:nome',  pageController.produto)
router.get('/criar-conta',  pageController.criarConta)
router.get('/entrar',  pageController.entrar)
router.get('/categoria/:categoria',  pageController.gridProdutos)
router.get('/checkout', pageController.checkout)

module.exports = router
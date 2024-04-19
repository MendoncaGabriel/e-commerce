const express = require('express')
const router = express.Router()
const lojaController = require('../../controllers/loja/loja.controller')

router.get('/',  lojaController.home)
router.get('/produto/:nome',  lojaController.produto)
router.get('/checkout',  lojaController.checkout)
router.get('/criar-conta',  lojaController.criarConta)

module.exports = router
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/', adminController.paginaCadastro)
router.get('/cadastro/produto', adminController.cadastroProduto)
router.get('/edicao/produto', adminController.edicaoProduto)


module.exports = router
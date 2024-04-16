const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/', adminController.home)
router.get('/cadastro/produto', adminController.cadastroProduto)
router.get('/lista/produto', adminController.listaProduto)
router.get('/edicao/produto/:id', adminController.edicaoProduto)


module.exports = router
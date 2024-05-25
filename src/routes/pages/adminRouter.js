const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/pages/adminController');




router.get('/lista/variante/:id', adminController.listaVariante);
router.get('/edicao/produto/:id', adminController.edicaoProduto);
router.get('/edicao/variante/:id', adminController.edicaoVariante);
router.get('/cadastro/produto', adminController.cadastroProduto);
router.get('/cadastro/variante/:id', adminController.cadastroVariante);
router.get('/lista/produto', adminController.listaProduto);
router.get('/categorias', adminController.categorias);
router.get('/', adminController.home);

module.exports = router;
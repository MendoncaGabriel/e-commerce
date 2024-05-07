const express = require('express');
const router = express.Router();
const produtoController = require('../../controllers/api/produto.controller');
const  upload = require('../middlewares/multer');
const compactarImagem = require('../middlewares/sharp');


router.post('/produto', upload.array('imagens'), compactarImagem,  produtoController.novoProduto);
router.get('/produto/:id', produtoController.pegarProdutoId);
router.get('/produto/lista/:pg', produtoController.listaProdutos);
router.patch('/produto/:id', upload.array('imagens'), compactarImagem, produtoController.atualizarProduto);
router.delete('/produto/:id', produtoController.removerProduto);





module.exports = router;
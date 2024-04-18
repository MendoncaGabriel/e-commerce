const express = require('express')
const router = express.Router()
const produtoController = require('../../controllers/api/produto.controller')


// MIDDLEWARE
const  upload = require('../../middlewares/multer')
const compactarImagem = require('../../middlewares/sharp')




//CRIAR
router.post('/produto', upload.array('imagens'),   produtoController.novoProduto)
router.post('/variante', produtoController.novaVariante)

//LER
router.get('/produto/:id', produtoController.pegarProdutoId)
router.get('/produto/lista/:pg', produtoController.listaProdutos)

//ATUALIZAR
router.patch('/produto/:id', upload.array('imagens'),compactarImagem, produtoController.atualizarProduto)

//DELETAR
router.delete('/variante/:id', produtoController.removerVariante)
router.delete('/produto/:id', produtoController.removerProduto)


module.exports = router
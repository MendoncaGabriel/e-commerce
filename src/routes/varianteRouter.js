const express = require('express');
const router = express.Router();
const produtoController = require('../../controllers/api/produto.controller');

router.post('/variante', produtoController.novaVariante);
router.get('/variante/:id', produtoController.pegarVarianteId);
router.delete('/variante/:id', produtoController.removerVariante);



module.exports = router;
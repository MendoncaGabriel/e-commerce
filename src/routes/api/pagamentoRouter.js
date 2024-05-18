const express = require('express');
const router = express.Router();
const pagamentoController = require('../../controllers/pagamentoController');
const processarItens = require('../../middlewares/processarItens');

router.post('/pix', processarItens, pagamentoController.mercadoPagoPix);

module.exports = router;
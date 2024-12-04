const express = require('express');
const router = express.Router();
const pagamentoController = require('../../controllers/pagamento.controller');
const processarItens = require('../../middlewares/processarItens');

router.get('/pix', processarItens, pagamentoController.getNet);
router.get('/status', pagamentoController.consultarStatus);


module.exports = router;
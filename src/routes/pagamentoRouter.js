const express = require('express');
const router = express.Router();
const pagamentoController = require('../../controllers/api/pagamento.controller');

//PAGAMENTO
router.post('/pagamento/qrcodepix', pagamentoController.gerarQrCodePix);

module.exports = router;
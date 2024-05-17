const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/usuarioController');


router.get('/endereco', usuarioController.getEndereco );
router.patch('/endereco', usuarioController.updateEndereco );
router.post('/pedido', usuarioController.pedido);

module.exports = router;
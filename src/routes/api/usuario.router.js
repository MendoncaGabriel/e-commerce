const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/usuario.controller');

router.get('/endereco', usuarioController.getEndereco );
router.patch('/endereco', usuarioController.updateEndereco );
router.post('/pedido', usuarioController.pedido);

module.exports = router;
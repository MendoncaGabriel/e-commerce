const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios/usuarioController');


router.patch('/endereco', usuarioController.endereco );
router.post('/pedido', usuarioController.pedido);

module.exports = router;
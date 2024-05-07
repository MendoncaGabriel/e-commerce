const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/api/usuario.controller');


router.patch('/usuario/endereco', usuarioController.endereco );
router.post('/usuario/novo', usuarioController.novoUsuario );
router.post('/usuario/pedido', usuarioController.pedido);

module.exports = router;
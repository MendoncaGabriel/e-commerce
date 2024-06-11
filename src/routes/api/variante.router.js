const express = require('express');
const router = express.Router();

// Controller
const varianteController = require('../../controllers/variante.controller');

// Middleware
const upload = require('../../middlewares/upload');

// Rotas
router.post('/create/:produto_id', varianteController.create);

router.get('/geyById/:id', varianteController.getById);
router.get('/getByProdutoId/:id', varianteController.getByProdutoId);
router.patch('/update/:id', varianteController.update);
router.delete('/:id', varianteController.delete);

module.exports = router
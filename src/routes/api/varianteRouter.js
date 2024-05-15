const express = require('express');
const router = express.Router();
const varianteController = require('../../controllers/variante/varianteController');

router.post('/create', varianteController.create);
router.get('/geyById/:id', varianteController.getById);
router.get('/getByProdutoId/:id', varianteController.getByProdutoId);
router.patch('/update/:id', varianteController.update);
router.delete('/:id', varianteController.delete);

module.exports = router
const express = require('express');
const router = express.Router();
const varianteController = require('../../controllers/varianteController');
const upload = require('../../middlewares/upload');

router.post('/create/:produto_id', upload, varianteController.create);
router.get('/geyById/:id', varianteController.getById);
router.get('/getByProdutoId/:id', varianteController.getByProdutoId);
router.patch('/update/:id', upload, varianteController.update);
router.delete('/:id', varianteController.delete);

module.exports = router
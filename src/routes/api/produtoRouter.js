const express = require('express');
const router = express.Router();
const  upload = require('../../middlewares/multer');
const compactarImagem = require('../../middlewares/sharp');
const produtoController = require('../../controllers/produtoController');

router.post('/create', upload.array('imagens'), compactarImagem,  produtoController.create);
router.get('/getById/:id', produtoController.getById);
router.get('/getByCategoria', produtoController.getByCategoria);
router.get('/getByOffset', produtoController.getByOffset);
router.patch('update/:id', upload.array('imagens'), compactarImagem, produtoController.update);
router.delete('delete/:id', produtoController.delete);

module.exports = router;
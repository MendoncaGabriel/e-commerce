const express = require('express');
const router = express.Router();
const  upload = require('../../middlewares/multer');
const compactarImagem = require('../../middlewares/compressImage');
const produtoController = require('../../controllers/produtoController');

router.post('/create',  produtoController.create);
router.patch('/update/:id', compactarImagem, upload.single('imagem'), produtoController.update);


router.get('/getById/:id', produtoController.getById);
router.get('/getByCategoria', produtoController.getByCategoria);
router.get('/getByOffset', produtoController.getByOffset);
router.delete('delete/:id', produtoController.delete);

module.exports = router;
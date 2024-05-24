const express = require('express');
const router = express.Router();
const produtoController = require('../../controllers/produtoController');
const  upload = require('../../middlewares/upload');


router.post('/create',  produtoController.create);
router.patch('/update/:id', upload ,produtoController.update);


router.get('/getById/:id', produtoController.getById);
router.get('/getByCategoria', produtoController.getByCategoria);
router.get('/getByOffset', produtoController.getByOffset);
router.delete('delete/:id', produtoController.delete);

module.exports = router;
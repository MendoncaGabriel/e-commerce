const express = require('express');
const router = express.Router();
const categoriaController = require('../../controllers/categoriaController');

router.post('/create', categoriaController.create);
router.get('/getAll', categoriaController.getAll);
router.patch('/update/:id', categoriaController.update);
router.delete('/delete/:id', categoriaController.delete);

module.exports = router;
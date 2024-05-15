const express = require('express');
const router = express.Router();
const varianteController = require('../../controllers/variante/varianteController');

router.delete('/:id', varianteController.remover);

module.exports = router
const express = require('express');
const router = express.Router();
const pesquisaController = require('../../controllers/pesquisaController');


router.post('/', pesquisaController.busca);


module.exports = router;
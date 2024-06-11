const express = require('express');
const router = express.Router();
const produtoController = require('../../controllers/produto.controller');
const upload = require('../../middlewares/upload');

//converter R$10,00 para 10.00
const tratarPreco = (req, res, next) => {
    try {
        const precoString = req.body.preco;
        const custoString = req.body.custo;

        if (precoString) req.body.preco = parseFloat(precoString.replace(',', '.').replace(' ', '').toLowerCase().replace('r$', '')).toFixed(2);
        if (custoString) req.body.custo = parseFloat(custoString.replace(',', '.').replace(' ', '').toLowerCase().replace('r$', '')).toFixed(2);
    } catch (error) {
        console.log(error);
    }
    next()
};

router.post('/create', produtoController.create);
router.get('/getById/:id', produtoController.getById);
router.get('/getByOffset', produtoController.getByOffset);
router.patch('/update/:id',  produtoController.update);
router.delete('/delete/:id', produtoController.delete); 

module.exports = router;
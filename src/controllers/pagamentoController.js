const pagamentoModel = require('../model/pagamentoModel');

module.exports = {
    mercadoPagoPix: async  (req, res) => {
        try {
            const {description, email, identificationType, number } = req.body;
            const transaction_amount = req.locals.precoTotal;
            const paymentMethodId = 'pix'

            const result = await pagamentoModel.mercadoPagoPix(transaction_amount, description, paymentMethodId, email, identificationType, number);
            res.status(200).json({msg: 'pix', result})
            
        } catch (error) {
            res.status(500).json(error)
            console.log(error)
        }
    }
}
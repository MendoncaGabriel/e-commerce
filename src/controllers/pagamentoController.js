const pagamentoModel = require('../model/pagamentoModel');

module.exports = {
    mercadoPago: async (req, res) => {
        try {
            const { description, email, identificationType, number } = req.body;
            const transaction_amount = req.locals.precoTotal;
            const paymentMethodId = 'pix';

            // Chamada ao modelo para criar o pagamento no Mercado Pago Pix
            const result = await pagamentoModel.mercadoPagoPix(transaction_amount, description, paymentMethodId, email, identificationType, number);
            
            // Log das informações do pagamento criado
            console.log('===> id: ', result.id);
            console.log('===> transaction_amount: ', result.transaction_amount);
            console.log('===> idempotencyKey: ', result.idempotencyKey);

            // Retorna a resposta para o cliente
            res.status(200).json({ msg: 'pix', result });
        } catch (error) {
            // Tratamento de erro, caso ocorra
            console.error('Erro no pagamento via Mercado Pago Pix:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    },
    getNet: async (req, res) => {

        try {
            const valorTotal = req.locals.precoTotal;
            if(!valorTotal || valorTotal <= 0 ) throw new Error('Erro no pagamento')
            const result = await pagamentoModel.getnetPix(valorTotal);
   
            res.status(200).json({ msg: 'pix', result });
        } catch (error) {
            console.error('Erro no pagamento via Mercado Pago Pix:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
};

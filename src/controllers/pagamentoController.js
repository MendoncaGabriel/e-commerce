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
            const auth = result.auth;
            delete result.auth;
            console.log(result)
   
            res.status(200).json({ msg: 'pix', result });
        } catch (error) {
            console.error('Erro no pagamento via Mercado Pago Pix:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    },
    consultarStatus: async (req, res) => {
        try {
            const payment_id = '53d3f4b1-ca80-404a-aa26-6fb570dbca0f' //req.body
            const result = await pagamentoModel.consultarStatus(payment_id)
            res.status(200).json({msg: "", result: result})
        } catch (error) {
            res.status(500).json(error)
            console.log(error)
            
        }
    }
};
//53d3f4b1-ca80-404a-aa26-6fb570dbca0f
// {
//     description: 'O QR Code foi gerado com sucesso e aguardando o pagamento. (81).',
//     additional_data: {
//       transaction_id: '06001000000013289935303135208',
//       qr_code: '00020101021226850014br.gov.bcb.pix2563pix.santander.com.br/qr/v2/50e810cd-9ddd-4722-bacf-a59674cdb50c52045310530398654042.995802BR5915SHOP DOS BALOES6006MANAUS62070503***6304DCE6',
//       creation_date_qrcode: '2024-05-22T14:22:04Z',
//       expiration_date_qrcode: '2024-05-22T14:25:04Z',
//       psp_code: '0033'
//     },
//     payment_id: '53d3f4b1-ca80-404a-aa26-6fb570dbca0f',
//     status: 'WAITING',
//     uuid: 'M-068b1191-15af-4194-a785-915d03d9e14b'
// }
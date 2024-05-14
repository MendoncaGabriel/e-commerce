require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { Payment, MercadoPagoConfig,  } = require('mercadopago');

// const accessToken = await access_token();
module.exports = {
    mercadoPagoPix: async (transaction_amount, description, paymentMethodId, email, identificationType, number) => {
        const client = new MercadoPagoConfig({ accessToken: process.env.ACCESSTOKEN });
        const payment = new Payment(client);

        return new Promise((resolve, reject) => {
            const uuid = uuidv4();
            payment.create({
                body: { 
                    transaction_amount: transaction_amount,
                    description: description,
                    payment_method_id: paymentMethodId,
                        payer: {
                        email: email,
                        identification: {
                    type: identificationType,
                    number: number
                }}},
                requestOptions: { idempotencyKey: uuid }
            })
            .then((result) => resolve(result))
            .catch((error) => reject(error));
        })

    },
    notificarPagamento: async (id, transaction_amount) => {
        const client = new MercadoPagoConfig({ accessToken: process.env.ACCESSTOKEN });
        const payment = new Payment(client);
       
        payment.capture({
            id: id,
            transaction_amount: transaction_amount,
            requestOptions: {
                idempotencyKey: '<IDEMPOTENCY_KEY>'
            }
        }).then(console.log).catch(console.log);
    }
}





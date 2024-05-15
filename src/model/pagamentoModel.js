require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { Payment, MercadoPagoConfig,  } = require('mercadopago');
const { promises } = require('supertest/lib/test');

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
    getnetPix: async () => {
        return new Promise( async (resolve, reject) => {
            function base64 (){
                const Client_ID = "7ddd8d35-0e0a-4f58-b928-719eca35659b"
                const Client_Secret = "YkBvQUsngF336WiaCoPci4X70UIm7XNB"
                const token = Client_ID + ':' + Client_Secret
                return btoa(token)
            }
            function authorization(){
                const formData = new URLSearchParams();
                formData.append('scoop', 'oob');
                formData.append('grant_type', 'client_credentials');

                return new Promise((resolve, reject)=> {
                    fetch('https://api.getnet.com.br/auth/oauth/v2/token', {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded",
                            "Authorization": `Basic ${base64()}`
                        },
                        body: formData
                    })
                    .then(response =>  response.json())
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    });
                })
            }
 
            const auth = await authorization();
            const seller_id = "e965427e-93db-4f88-aacd-052f644f2e9f";

            fetch('https://api.getnet.com.br/v1/payments/qrcode/pix', {
                method: 'POST',
                headers: {
                    "seller_id": seller_id,
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": `Bearer ${auth.access_token}`,
                    "x-qrcode-expiration-time": "180"
                },
                body: JSON.stringify({
                    amount: 100,
                    currency: "BRL",
                    customer_id: "string",
                    order_id: "DEV-160874898asd0"
                })
            })
            .then(response =>  response.json())
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            });
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





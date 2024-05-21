require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { Payment, MercadoPagoConfig,  } = require('mercadopago');

module.exports = {
    mercadoPagoPix: async (transaction_amount, description, paymentMethodId, email, identificationType, number) => {
        try {
            const client = new MercadoPagoConfig({ accessToken: process.env.ACCESSTOKEN });
            const payment = new Payment(client);
            const uuid = uuidv4();
            
            const result = await payment.create({
                body: { 
                    transaction_amount: transaction_amount,
                    description: description,
                    payment_method_id: paymentMethodId,
                    payer: {
                        email: email,
                        identification: {
                            type: identificationType,
                            number: number
                        }
                    }
                },
                requestOptions: { idempotencyKey: uuid }
            });
    
            result.idempotencyKey = uuid;
            return result;
        } catch (error) {
            throw new Error(`Erro ao processar pagamento via Mercado Pago: ${error.message}`);
        }
    },
    getnetPix: async (valorCentavos) => {
        return new Promise( async (resolve, reject) => {
            function base64 (){
                const Client_ID = process.env.Client_ID;
                const Client_Secret = process.env.Client_Secret;
                const token = Client_ID + ':' + Client_Secret
                return btoa(token)
            }
            function tranformCentavos(real){
                const centavos = real * 100
                return centavos
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
            const seller_id = process.env.Client_ID;
            const uuid = uuidv4();

            fetch('https://api.getnet.com.br/v1/payments/qrcode/pix', {
                method: 'POST',
                headers: {
                    "seller_id": seller_id,
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": `Bearer ${auth.access_token}`,
                    "x-qrcode-expiration-time": "180" // 3min
                },
                body: JSON.stringify({
                    amount: tranformCentavos(valorCentavos),
                    currency: "BRL",
                    customer_id: "string",
                    order_id: `M-${uuid}`   
                })
            })
            .then(res =>  res.json())
            .then(res => {
                resolve(res)
            })
            .catch(error => {
                reject(error)
            });
        })
    }
}
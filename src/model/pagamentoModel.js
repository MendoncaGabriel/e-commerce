require('dotenv').config();
const { v4: uuidv4 } = require('uuid');


//GERAR CHAVE EM BASE 64
class KeyBase64 {
    #Client_ID = process.env.Client_ID;
    #Client_Secret = process.env.Client_Secret;

    constructor() {
        if (!this.#Client_ID || !this.#Client_Secret) {
            throw new Error('!!! Client_ID e Client_Secret não foram definidos corretamente.');
        }
        this.key = btoa(`${this.#Client_ID}:${this.#Client_Secret}`);
    }

    get auth() {
        return this.key;
    }
}

//SOLICITAR TOKEN DE ACESSO
class Authorization {
    #base64 = new KeyBase64();

    async getAuth() {
        try {
            const url = 'https://api.getnet.com.br/auth/oauth/v2/token';
            const formData = new URLSearchParams();
            formData.append('scope', 'oob');
            formData.append('grant_type', 'client_credentials');

            const configs = { 
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${this.#base64.auth}`
                },
                body: formData
            };

            const response = await fetch(url, configs);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`Erro ao solicitar token: ${data.error_description}`);
            }

            return data;
        } catch (error) {
            console.error('Erro na solicitação de token:', error);
            throw error;
        }
    }
}

//SOLICITAR PAGAMENTOS
class Pagamento {
    #seller_id = process.env.Seller_ID;
    #uuid = uuidv4()
    #auth = null

    constructor(){
        this.expirationTime = "180" //3min 
    }

    #formatValor(valor) {
        if (typeof valor == 'string') {
            const valorSemSimbolo = valor.replace(/R\$|\s+/g, '');
            const valorEmCentavos = valorSemSimbolo.replace(',', '');
            return parseInt(valorEmCentavos, 10);
        }else{
            return parseInt(valor, 10);
        }
    }

    async qrcodePix(valor){
        this.valor = this.#formatValor(valor)
        const authorization = new Authorization();
        this.#auth = await authorization.getAuth();
            
        return new Promise( async (resolve, reject) => {
            const url = 'https://api.getnet.com.br/v1/payments/qrcode/pix';

            const config = {
                method: 'POST',
                headers: {
                    "seller_id": this.#seller_id,
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": `Bearer ${this.#auth.access_token}`,
                    "x-qrcode-expiration-time": this.expirationTime 
                },
                body: JSON.stringify({
                    amount: this.valor,
                    currency: "BRL",
                    customer_id: "string",
                    order_id: this.#uuid   
                })
            }
            fetch(url, config)
            .then(res =>  res.json())
            .then(res => {
                res.uuid = this.#uuid;
                return resolve(res)
            })
            .catch(error => {
                return reject(error)
            });
        })
    }
}

// FERIFICAR STATUS DE PAGAMENTO
class Notificacao {
    #auth = null;
    #seller_id = process.env.Seller_ID;
 
    async statusPayment(payment_id) {
        try {
            const authorization = new Authorization();
            this.#auth = await authorization.getAuth();

            const url = `https://api.getnet.com.br/v1/payments/qrcode/${payment_id}`;
            const config = {
                method: 'GET',
                headers: {
                    "seller_id": this.#seller_id,
                    "Authorization": `Bearer ${this.#auth.access_token}`,
                }
            };

            const maxTimeout = 110000; // 1 minuto e 50 segundos em milissegundos
            const startTime = Date.now();

            const checkPaymentStatus = async () => {
                try {
                    const response = await fetch(url, config);
                    const data = await response.json();

                    // if (!response.ok) {
                    //     console.log(`Erro na requisição:`,  data);

                    //     return
                    // }

                    // ver status
                    if(!data.status){
                        console.log(data)
                    }else{
                        console.log(`Status atual: ${data.status}`);
                    }

                    // Verifica se o pagamento foi confirmado
                    if (data.status === 'APPROVED') {
                        console.log('Pagamento confirmado!');
                        return data;
                    }

                    // Verifica se o pagamento foi negado
                    if (data.status === 'DENIED') {
                        console.log('Pagamento negado!');
                        return data;
                    }

                    // Verifica se atingiu o tempo máximo de espera
                    const elapsedTime = Date.now() - startTime;
                    if (elapsedTime >= maxTimeout) {
                        console.log('Tempo máximo de espera atingido. Status ainda é PENDING.');
                        return data;
                    }

                    // Aguarda e verifica novamente
                    setTimeout(async () => {
                        await checkPaymentStatus();
                    }, 110000 ); // Aguarda 1 min e 50 segundos entre cada verificação
                } catch (error) {
                    console.error('Erro na requisição:', error.message);
                    throw error; // Propaga o erro para ser tratado externamente, se necessário
                }
            };

            // Inicia o processo de verificação do status do pagamento
            await checkPaymentStatus();
        } catch (error) {
            console.error('Erro ao verificar status de pagamento:', error);
            //throw error; // Propaga o erro para ser tratado externamente, se necessário
        }
    }
}



module.exports = {
    getnetPix: async (valor) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pagamento = new Pagamento()
                const pix = await pagamento.qrcodePix(valor)

                const consulta = new Notificacao()

                // testando novo modulo de consulta
                consulta.statusPayment(pix.payment_id)
                
             
                resolve(pix)
            } catch (error) {
                reject(error)
            }
        })
    }
}
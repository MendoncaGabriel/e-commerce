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
        this.key = Buffer.from(`${this.#Client_ID}:${this.#Client_Secret}`).toString('base64');
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
    #uuid = uuidv4();
    #auth = null;

    constructor() {
        this.expirationTime = "180"; // 3min 
    }

    #formatValor(valor) {
        if (typeof valor == 'string') {
            const valorSemSimbolo = valor.replace(/R\$|\s+/g, '');
            const valorEmCentavos = valorSemSimbolo.replace(',', '');
            return parseInt(valorEmCentavos, 10);
        } else {
            return parseInt(valor, 10);
        }
    }

    async qrcodePix(valor) {
        this.valor = this.#formatValor(valor);
        const authorization = new Authorization();
        this.#auth = await authorization.getAuth();
            
        return new Promise((resolve, reject) => {
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
            };

            fetch(url, config)
                .then(res => res.json())
                .then(res => {
                    res.uuid = this.#uuid;
                    return resolve(res);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }
}


// FERIFICAR STATUS DE PAGAMENTO
class Notificacao {
    #auth = null;
    #seller_id = process.env.Seller_ID;

    async statusPayment(payment_id) {
        try {
            console.log('===> payment_id: ', payment_id);
            const authorization = new Authorization();
            this.#auth = await authorization.getAuth();
    
            const url = `https://api.getnet.com.br/v1/payments/qrcode/${payment_id}`;
            const config = {
                method: 'GET',
                headers: {
                    "seller_id": this.#seller_id,
                    "Authorization": `Bearer ${this.#auth.access_token}`,
                    "Content-Type": "application/json; charset=utf-8",
                }
            };
    
            const intervalId = setInterval(async () => {
                try {
                    const response = await fetch(url, config);
                    const data = await response.json();
                    console.log(data);

                    // Verifique o status de pagamento e pare o intervalo se o pagamento estiver concluído
                    if (data.status === 'completed') {
                        clearInterval(intervalId);
                        console.log('Pagamento concluído.');
                    }
                } catch (innerError) {
                    console.error('Erro ao buscar status de pagamento:', innerError);
                }
            }, 5000);
        } catch (error) {
            console.error('Erro ao verificar status de pagamento:', error);
        }
    }
}




module.exports = {
    getnetPix: async (valor) => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pagamento = new Pagamento()
                    const pix = await pagamento.qrcodePix(valor)
    
                    // const consulta = new Notificacao()
                    // console.log(pix.payment_id)
                    // console.log(pix)
    
                  
                    
                 
                    resolve(pix)
                } catch (error) {
                    reject(error)
                }
            })();
        })
    }
}


// mysql://mysql:@Gam1997Vsc*@db_maquiagem_db_maquiagem:3306/db_maquiagem
// 
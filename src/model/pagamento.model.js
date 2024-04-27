require('dotenv').config()

module.exports = {
    gerarQrCodePix: (token, valor) => {
        if (!valor || valor <= 0) {
            throw new Error('Valor inválido');
        }
        
        return new Promise((resolve, reject) => {
            const url = process.env.API_QRCODEPIX;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'seller_id': process.env.ID_VENDEDOR //id do vendedor sandbox
                },
                body: JSON.stringify({
                    "amount": parseInt(valor),
                    "currency": "BRL",
                    "order_id": "DEV-1608748980", //id do pedido
                    "customer_id": "string"
                })
            })
            .then(res => res.json())
            .then(res => {
                resolve(res)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    auth: async () => {
        const url = process.env.API_AUTH
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        formData.append('scope', 'oob');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${process.env.TOKEN_AUTENTICACAO}`
                },
                body: formData.toString()
            });

            if (!response.ok) {
                throw new Error('Erro na solicitação de autenticação');
            }
    
            return await response.json();
        } catch (error) {
            throw new Error('Erro ao processar a solicitação de autenticação');
        }
    }
}
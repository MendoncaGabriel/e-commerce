require('dotenv').config();

// Authorization base64 oAuth
const clientID = process.env.Client_ID;
const clientSecret = process.env.Client_Secret;
const Seller_ID = process.env.Seller_ID;
const authString = clientID + ':' + clientSecret;
const base64AuthString = btoa(authString);



//HOMOLOGAÇÃO
// const authString = "YTE1NjljYjEtOWUwNS00MjA0LWFhM2UtNjMyNjg4N2I4ZTY4OmFhYWUxZjgzLWE5NjUtNGUyMC1hZjY0LWYzOGQyMzMzY2U4MQ==";
// const Seller_ID = "e965427e-93db-4f88-aacd-052f644f2e9f";
// const accessToken =  "35c5e0f0-5bae-4136-88d1-3a112160bd27";


async function gerarPix(valor, token){
    const valorEmCentavos = String(Number(valor) * 100);
    const centavos = valorEmCentavos.replace('.', '')



    return new Promise((resolve, reject) => {
        fetch("https://api-sandbox.getnet.com.br/v1/payments/qrcode/pix", {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json; charset=utf-8",
                "seller_id": Seller_ID
              },
            body: JSON.stringify({
                "amount": centavos,
                "currency": "BRL",
                "order_id": "DEV-1608748980",
                "customer_id": "string"
            })
        })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            reject(error)
        });
    });
}
async function access_token(){
    return new Promise((resolve, reject) => {


        try {
            fetch("https://api-homologacao.getnet.com.br/auth/oauth/v2/token", {
                method: "POST",
                headers:{
                    "Authorization": "Basic " + base64AuthString,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    scope: "oob",
                    grant_type: "client_credentials"
                }).toString()
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Request failed with status " + res.status);
                }
                return res.json();
            })
            .then(res => {
                resolve(res)
            })
            .catch(error => {
                console.error("===> Error fetching access token:", error);
                resolve(null); // You can also reject here if needed
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            resolve(null);
        }
    });
}

// const accessToken = await access_token();
module.exports = {

    gerarQrCodePix: async (precoTotal) => {
        const access = await access_token();
        const token = access?.access_token;
        console.log("===> ", token)
        const pix = await gerarPix(precoTotal, token)
        

        return pix
    }
}
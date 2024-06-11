const { v4: uuidv4 } = require('uuid');

const getAuth = async () => {
  try {
    const Client_ID = process.env.Client_ID;
    const Client_Secret = process.env.Client_Secret;

    if (!Client_ID || !Client_Secret) {
      throw new Error('!!! Client_ID e Client_Secret não foram definidos corretamente.');
    }

    const key = Buffer.from(`${Client_ID}:${Client_Secret}`).toString('base64');
    const url = 'https://api.getnet.com.br/auth/oauth/v2/token';
    const formData = new URLSearchParams();
    formData.append('scope', 'oob');
    formData.append('grant_type', 'client_credentials');

    const configs = {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${key}`,
      },
      body: formData,
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
};
const formatarValor = (valor) => {
  if (typeof valor === 'string') {
    const valorSemSimbolo = valor.replace(/R\$|\s+/g, '');
    const valorEmCentavos = valorSemSimbolo.replace(',', '');
    return parseInt(valorEmCentavos, 10);
  } else {
    return parseInt(valor, 10);
  }
};
const qrcodePix = async (valor) => {
  const auth = await getAuth();
  const uuid = uuidv4();
  const expirationTime = '180'; // 3min
  const valorFormatado = formatarValor(valor);

  const url = 'https://api.getnet.com.br/v1/payments/qrcode/pix';
  const config = {
    method: 'POST',
    headers: {
      seller_id: process.env.Seller_ID,
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${auth.access_token}`,
      'x-qrcode-expiration-time': expirationTime,
    },
    body: JSON.stringify({
      amount: valorFormatado,
      currency: 'BRL',
      customer_id: 'string',
      order_id: uuid,
    }),
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    data.uuid = uuid;
    return data;
  } catch (error) {
    console.error('Erro ao gerar QR Code Pix:', error);
    throw error;
  }
};
const statusPayment = async (payment_id) => {
  try {
    console.log('===> payment_id: ', payment_id);
    const auth = await getAuth();
    const url = `https://api.getnet.com.br/v1/payments/qrcode/${payment_id}`;
    const config = {
      method: 'GET',
      headers: {
        seller_id: process.env.Seller_ID,
        Authorization: `Bearer ${auth.access_token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
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
};


exports.getnetPix = async (valor) => {
  try {
    const pix = await qrcodePix(valor);
    return pix;
  } catch (error) {
    console.error('Erro ao processar QR Code Pix:', error);
    throw error;
  }
}
const pagamentoModel = require('../model/pagamentoModel');



module.exports = {
    getNet: async (req, res) => {
        //usar isto para modulo de registro de pedidos
        // const carrinho = req.locals.itensVerificados
        // const userToken = req.cookies.token

        try {
            const valorTotal = req.locals.precoTotal;
            if(!valorTotal || valorTotal <= 0 ) throw new Error('Erro no pagamento')
            const result = await pagamentoModel.getnetPix(valorTotal);
            

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

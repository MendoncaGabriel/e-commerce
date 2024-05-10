const pagamentoModel = require('../../model/pagamentoModel');

module.exports = {
    gerarQrCodePix: async (req, res) => {
        const {carrinho, itensVerificados, precoTotal } = req.locals;
        if(!precoTotal || typeof precoTotal == "undefined") res.status(500).json({msg: 'Erro: não identificado precoTotal em gerarQrCodePix'});

        const pix = await pagamentoModel.gerarQrCodePix(precoTotal);

        res.status(200).json({pix})
     
    }
}
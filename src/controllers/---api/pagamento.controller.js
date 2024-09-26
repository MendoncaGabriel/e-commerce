
const pagamentoModel = require('../../model/pagamento.model')

module.exports = {
    gerarQrCodePix: async (req, res) => {
        try {
            const {valor} = req.body
            const auth = await pagamentoModel.auth()
            const pix = await pagamentoModel.gerarQrCodePix(auth.access_token, valor)

            console.log('===> valor: ', valor)
            console.log('===> auth: ', auth)
            console.log('===> pix: ', pix)
          
            res.status(200).json(pix)
        } catch (error) {
            res.status(500).json({msg: 'Erro interno no servidor', error: error.message})
        }
    }
}
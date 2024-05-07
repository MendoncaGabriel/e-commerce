const pedidomodel = require('../../model/pedidoModel')

module.exports = {
    fazerPedido: async (req, res) => {
        await  pedidomodel.fazerPedido()
        res.send('em construção')
    }
}
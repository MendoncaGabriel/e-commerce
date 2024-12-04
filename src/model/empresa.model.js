const Loja = require('../../database/schemas/loja.schema');

exports.getData = async (id) => {
    try {
        return await Loja.findByPk(id)
    } catch (error) {
        console.error(error)
        throw error
    }
}

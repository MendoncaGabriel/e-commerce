const Loja = require('../../database/schemas/loja.schema');

exports.getById = async (id) => {
    try {
        const loja = await Loja.findByPk(id);
        return loja.dataValues
    } catch (error) {
        console.error(error)
        throw error
    }
}
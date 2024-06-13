const PaletaCores = require('../../database/schemas/paleta.cores.schema');

exports.getById = async (id) => {
    try {
        const paleta = await PaletaCores.findByPk(id)
        return paleta.dataValues
    } catch (error) {
        console.error(error)
        throw error
    }
}
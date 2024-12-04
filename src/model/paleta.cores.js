const PaletaCores = require('../../database/schemas/paleta.cores.schema');

exports.getByLojaId = async (id) => {
    try {
        const paleta = await PaletaCores.findOne({
            where:{LojaId: id}
        })
        return paleta.dataValues
    } catch (error) {
        console.error(error)
        throw error
    }
}
const Carrosel = require('../../database/schemas/carrosel.schema');

exports.getAll = async (loja_id) => {
    try {
        const carrosel = await Carrosel.findAll({where: {
            loja_id: loja_id
        }})

        return carrosel.map(e => e.dataValues)
    } catch (error) {
        console.error(error)
        throw error
    }
}
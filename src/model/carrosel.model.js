const Carrosel = require('../../database/schemas/carrossel.schema');

exports.getAll = async (loja_id) => {
    try {
        const carrosel = await Carrosel.findAll({where: {
            lojaId: loja_id
        }})

        return carrosel.map(e => e.dataValues)
    } catch (error) {
        console.error(error)
        throw error
    }
}
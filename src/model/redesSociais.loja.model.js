const RedeSocial = require('../../database/schemas/redesSociais.schema');

exports.create = async (nome, url) => {
    try {
        return await RedeSocial.create({
            nome: nome,
            url: url
        })
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.getAll = async (loja_id) => {
    try {
        const redes = await RedeSocial.findAll({where: {LojaId: loja_id}});
        return redes.map(e => e.dataValues);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
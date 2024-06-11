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

exports.getAll = async () => {
    try {
        return await RedeSocial.findAll();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
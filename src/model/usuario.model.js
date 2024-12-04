const usuario = require('../../database/schemas/usuario.schema');

exports.updateEndereco = async (data, id) => {
    try {
        usuario.update({
            rua: data.rua,
            bairro: data.bairro, 
            cep: data.cep,
            cidade: data.cidade,
            estado: data.estado,
            pais: data.paid,
            numero_casa: data.numero_casa,
            referencia: data.referencia,
            telefone: data.telefone
        }, {where:{id}})
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.getEndereco = async (id) =>{
    try {
       return await usuario.findByPk(id, {attributes: ["rua", "bairro", "cep", "cidade", "estado", "pais", "numero_casa", "referencia", "telefone"]});
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.getById = async (id) =>{
    try {
        return await usuario.findByPk(id)
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.usuarioExist = async (nome, email, telefone) => {
    try {
        return await Usuario.findOne({
            where: {
                [Op.or]: [
                    { nome: nome },
                    { email: email },
                    { telefone: telefone }
                ]
            }
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};
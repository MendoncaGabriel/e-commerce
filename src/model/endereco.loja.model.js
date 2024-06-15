const EnderecoLoja = require('../../database/schemas/endereco.loja.schema');

exports.getAll = async (loja_id) => {
    try {
        return await EnderecoLoja.findAll({ where: { lojaId: loja_id } });
    } catch (error) {
        console.error(error);
        throw error;
    }
}
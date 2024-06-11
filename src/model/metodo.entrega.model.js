const MetodoEntrega = require('../../database/schemas/metodo.entrega.schema');

exports.getAll = async () => {
    try {
        return await MetodoEntrega.findAll();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
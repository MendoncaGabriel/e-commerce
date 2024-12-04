const Categoria = require('../../database/schemas/categoria.produto.shchema');

exports.create = async (nome) => {
    try {
        return await Categoria.create({
            nome: nome
        });
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
    }
};

exports.getAll = async () => {
    try {
        return await Categoria.findAll();
    } catch (error) {
        console.error('Erro ao buscar todas as categorias:', error);
        throw error;
    }
};

exports.update = async (id, nome) => {
    try {
        return await Categoria.update({
            nome: nome
        }, { where: { id } });
    } catch (error) {
        console.error(`Erro ao atualizar categoria com id ${id}:`, error);
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        return await Categoria.destroy({ where: { id } });
    } catch (error) {
        console.error(`Erro ao excluir categoria com id ${id}:`, error);
        throw error;
    }
};
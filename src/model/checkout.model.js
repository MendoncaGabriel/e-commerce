const Produto = require('../../database/schemas/produto.schema');
const Variante = require('../../database/schemas/variante.produto.schema');

const getVarianteById = async (varianteId) => {
    try {
        const variante = await Variante.findOne({
            where: { variante_id: varianteId },
            include: { model: Produto }
        });
        if (!variante) {
            throw new Error('Variante não encontrada no banco de dados');
        }
        return variante;
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao obter variante do carrinho');
    }
};

const getProdutoById = async (produtoId) => {
    try {
        const produto = await Produto.findByPk(produtoId);
        if (!produto) {
            throw new Error('Produto não encontrado no banco de dados');
        }
        return produto;
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao obter produto do carrinho');
    }
};

// Função principal para processar o checkout
exports.processCheckout = async (carrinho) => {
    if (!carrinho || carrinho.length === 0) {
        throw new Error('Carrinho está vazio');
    }

    const promessas = carrinho.map(async (element) => {
        try {
            if (typeof element.variante_id !== "undefined" && element.variante_id) {
                // É uma variante
                const variante = await getVarianteById(element.variante_id);

                const item = {
                    ...variante.dataValues,
                    qtd: Number(element.qtd),
                    total: Number(element.qtd) * Number(variante.preco)
                };

                return item;
            } else {
                // É um produto
                const produto = await getProdutoById(element.produto_id);

                const item = {
                    ...produto.dataValues,
                    qtd: Number(element.qtd),
                    total: Number(element.qtd) * Number(produto.preco)
                };

                return item;
            }
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao processar itens do carrinho');
        }
    });

    try {
        const itens = await Promise.all(promessas);

        let total = 0;
        itens.forEach(item => {
            total += item.total;
        });

        return { itens, total };
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao obter produtos do carrinho');
    }
};

const path = require('path');
const { Op, where } = require('sequelize');
const deleteFile = require('../utilities/deleteFile');
const Produto = require('../../database/schemas/produto.schema');
const Variante = require('../../database/schemas/variante.produto.schema');

async function removePreviousImagem(id) {
    try {
        const produto = await Produto.findByPk(id);
        if (!produto[0].imagem) return;

        const caminhoArquivo = path.resolve('src', 'public', 'img', produto[0].imagem);
        if(caminhoArquivo) await deleteFile(caminhoArquivo);
        
    } catch (error) {
        console.log("Erro ao remover imagem anterior do produto:", error);
    }
}

async function removeVariantesAndImagens (id){
    try {        
        const variantes = await Variante.findAll({where: {produto_id: id}});
    
        for(let e of variantes){
            if(e.imagem){
                const caminhoArquivo = path.resolve('src', 'public', 'img', e[0].imagem);
                await deleteFile(caminhoArquivo)
            }
    
            Variante.destroy({where:{id: e.id}})
        }
    } catch (error) {
        console.log("Erro ao remover variante:", error)
    }
}

exports.create = async (data, imagem) => {
    try {
        const novoProduto = await Produto.create({
            nome: data.nome,
            descricao: data.descricao,
            ativo: true, // Valor padrão definido
            marca: data.marca,
            modelo: data.modelo,
            preco: 10.00, // Valor padrão fornecido
            tamanho: data.tamanho,
            quantidade: data.quantidade, // Aqui deve ser um número
            referencia: data.referencia,
            vendas: 0, // Valor padrão definido
            ean: data.ean,
            estoque: 5, // Valor padrão fornecido
            custo: 3, // Valor padrão fornecido
            imagem: imagem || null, // Valor padrão fornecido
            categoria_id: data.categoria_id // Supondo que esse campo possa ser nulo
          });
        return novoProduto
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.getById = async (id) => {
    try {
        return await Produto.findByPk(id);
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.update = async (id, body) => {
    try {
        await removePreviousImagem(id);

        return await Produto.update({
            ativo: body.ativo == "on" ? 1 : 0,
            nome: body.nome, 
            modelo: body.modelo, 
            marca: body.marca, 
            categoria: body.categoria, 
            preco: body.preco, 
            tamanho: body.tamanho, 
            quantidade: body.quantidade, 
            referencia: body.referencia, 
            ean: body.ean, 
            estoque: body.estoque, 
            custo: body.custo, 
            descricao: body.descricao,
            imagem: body.imagem
        }, {where: {id}})
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.delete = async (id) => {
    try {
        await removePreviousImagem(id);
        await removeVariantesAndImagens(id);

        return await Produto.destroy({where: {id}})
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.getbyOffset = async (offset, limit, loja_id, titulo) => {
  try {
    const produtos = await Produto.findAll({
        offset: offset,
        limit: limit,
        where: { 
            loja_id: loja_id,
            carrosel: titulo
        }
    })

    return produtos.map(produto => produto.dataValues);
    
  } catch (error) {
    console.error('Erro ao buscar produtos com offset e limite:', error);
    throw error;
  }
};

exports.getBySearchTerm = async (termo) => {
    try {
        const palavras = termo.split(' ');

        const whereClause = {
            ativo: 1,
            [Op.and]: [
                {
                    [Op.or]: palavras.map(palavra => ({
                        nome: {
                            [Op.like]: `%${palavra.toLowerCase()}%`
                        }
                    }))
                },
                {
                    '$Variantes.imagem$': {
                        [Op.not]: null
                    }
                },
                {
                    '$Variantes.imagem$': {
                        [Op.ne]: ''
                    }
                },
                {
                    '$Variantes.estoque$': {
                        [Op.gt]: 0
                    }
                }
            ]
        };

        const produtos = await Produto.findAll({
            where: whereClause,
            include: [{
                model: Variante,
                required: true // INNER JOIN
            }],
            order: [
                [Sequelize.literal(`CASE
                    WHEN LOWER(produtos.nome) LIKE '${termo.toLowerCase()}%' THEN 1
                    ELSE 2
                END`), 'ASC'],
                ['nome', 'ASC']
            ],
            limit: 10
        });

        return produtos;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};


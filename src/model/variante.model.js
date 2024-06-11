const fs = require('fs');
const path = require('path');
const varianteSchema = require('../../database/schemas/variante.produto.schema');

function checkFile(caminhoArquivo){
    try{
        if (fs.existsSync(caminhoArquivo)) {
           return true
        } else {
            return false
        }
    }catch(error){
        console.log(error.message)
    }
};

function deleteFile(caminhoArquivo){
    try {
        fs.unlink(caminhoArquivo, function (error){
            if (error) throw new Error(error);

        })
    }
    catch (error) {
        console.log(error.message)
    }
};

async function apagarImagemAnterior(id){
    try {
        const produto = await module.exports.getById(id)
        const image = produto[0]?.imagem;
        const caminhoArquivo = path.resolve('src', 'public', 'img', image);
        if(!caminhoArquivo) throw new Error('Erro ao buscar caminho de arquivo!')
        const existsFile = checkFile(caminhoArquivo);
        if(existsFile) deleteFile(caminhoArquivo);
    } catch (error) {
        console.log(error.message)
    }
};


exports.create = async (data, produto_id, imagem) => {
    try {
        return await varianteSchema.create({
            ean: data.ean,
            cor: data.cor,
            imagem: imagem, 
            nome: data.nome,
            ativo: data.ativo,
            custo: data.custo,
            preco: data.preco,
            vendas: data.vendas,
            estoque: data.estoque,
            tamanho: data.tamanho,
            produto_id: produto_id,
            quantidade: data.quantidade,
            referencia: data.referencia
        });
    } catch (error) {
        console.error('Erro ao criar variante de produto:', error);
        throw error;
    }
};

exports.update = async (id, data, imagem) => {
    try {
        return await varianteSchema.update({
            ean: data.ean,
            cor: data.cor,
            imagem: imagem, 
            nome: data.nome,
            ativo: data.ativo,
            custo: data.custo,
            preco: data.preco,
            vendas: data.vendas,
            estoque: data.estoque,
            tamanho: data.tamanho,
            quantidade: data.quantidade,
            referencia: data.referencia
        }, {where: {id}})
    } catch (error) {
        console.error
        throw error
    }
};

exports.getById = async (id) => {
    try {
        return await varianteSchema.findByPk(id);
    } catch (error) {
        console.error
        throw error
    }
};

exports.getByProdutoId = async (id) => {
    try {
        return await varianteSchema.findAll({where:{produto_id: id}})
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.delete = async (id) => {
    try {
        return await varianteSchema.destroy({where:{variante_id: id}});
    } catch (error) {
        console.error(error)
        throw error
    }
};

exports.deleteByProdutoId = async (id) => {
    try {
        return await varianteSchema.destroy({where: {variante_id: id}});
    } catch (error) {
        console.error
        throw error
    }
};
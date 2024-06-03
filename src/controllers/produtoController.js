const produtoModel = require('../model/produtoModel');

module.exports = {
    create: async (req, res) => {
        try {
            const data = req.body;
            const imagemFile = req.file;
            const imagem =  imagemFile && imagemFile.filename ? imagemFile.filename : null;

            const result = await produtoModel.create(data, imagem)

            res.status(200).json({msg: "Novo produto criado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.getById(id)
            res.status(200).json({msg: "Produto resgatado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getProdutoWithVariantes: async (req, res) => {
        try {
            const id = req.params.name;
            const result = await produtoModel.getProdutoWithVariantes(id);
            res.status(200).json({msg: "Produto resgatado com sucesso!", result});
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'});
        }
    },
    getByCategoria: async (req, res) => {
        try {
            const categoria = req.params.categoria;
            const result = await produtoModel.getByCategoria(categoria);
            res.status(200).json({msg: "Produtos pegos por categoria", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getByOffset: async (req, res) => {
        try {
            const offset = Number(req.query.offset || 0);
            const limit = Number(req.query.limit || 20);
            const result = await produtoModel.getbyOffset(offset, limit)
            res.status(200).json({msg: "Lista de produtos resgatada com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    update: async (req, res) => {
        try {
            console.log( '=====================> categoria: ', req.body)





            const id = req.params.id;
            const { ativo, nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao } = req.body;
            const imagem = req.file ? req.file.filename : null;
            const result = await produtoModel.update(id, ativo == 'on' ? 1 : 0, nome, modelo, marca, categoria, preco, tamanho, quantidade, referencia, ean, estoque, custo, descricao, imagem);

            res.status(200).json({ msg: "Produto atualizado com sucesso!", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro interno no servidor' });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id
            const result = await produtoModel.delete(Number(id))
            res.status(200).json({msg: result})
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no servidor')
        }
    }
}
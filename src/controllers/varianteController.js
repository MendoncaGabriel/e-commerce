const varianteModel = require('../model/varianteModel');

module.exports = {
    create: async (req, res) => {
        try {   
            const data = req.body
            const produto_id = req.params.produto_id
            const imagem = req.file;
            const result = await varianteModel.create(data, produto_id, imagem && imagem.filename ? imagem.filename : null)
            res.status(200).json({msg: 'Nova variante de produto criada com sucesso!', result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id
            const result = await varianteModel.getById(id)
            res.status(200).json({msg: "Variante resgatado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getByProdutoId: async (req, res) => {
        try {
            const id = req.params.id
            const result = await varianteModel.getByProdutoId(id)
            res.status(200).json({msg: "Variante resgatado com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const imagemFile = req.file;
            const imagem =  imagemFile && imagemFile.filename ? imagemFile.filename : null;
            const result = await varianteModel.update(id, data, imagem)
            res.status(200).json({msg: "Variante atualizada com sucesso", result})
        } catch (error) {
            console.log(error)

            res.status(500).json({msg: 'Erro ao atualizar'})
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id
            const result = await varianteModel.delete(id)
            res.status(200).json({msg: "Variante deletada com sucesso!", result})
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no servidor')
        }
    }
}
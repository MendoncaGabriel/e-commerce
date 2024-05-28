const categoriaModel = require('../model/categoriaModel');

module.exports = {
    create: async (req, res) => {
        try {
            const {nome} = req.body;
            console.log(req.body)
            if(!nome) throw new Error('nome não foi passado')

            const result = await categoriaModel.create(nome)
            res.status(200).json({msg: "ok", result})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    getAll: async (req, res) => {
        try {

            const result = await categoriaModel.getAll()
            res.status(200).json({msg: "ok", result})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const {nome} = req.body;
            const result = await categoriaModel.update(id, nome)
            res.status(200).json({msg: "ok", result})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await categoriaModel.delete(id)
            res.status(200).json({msg: "ok", result})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: 'Erro interno no servidor'})
        }
    },

}
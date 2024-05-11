const varianteModel = require('../../model/varianteModel');
module.exports = {
    remover: async (req, res) => {
        try {
            const id = req.params.id;
            if(!id) throw new Error('Sem id em params');

            const result = await varianteModel.remover(id);
            if(result){
                res.status(200).json({msg: 'Variante removida com sucesso!'})
            }else{
                throw new Error('Error ao remover variante');
            }
        } catch (error) {
            console.log(error)
            console.log(error.message)
            res.status(500).json({msg: 'Erro interno no servidor'})
        }

    }
}
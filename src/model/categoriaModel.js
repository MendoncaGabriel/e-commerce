
const executeSql = require('../utilities/executarSql')

module.exports = {
    categorias: async () => {
        try {
            const sql = "select * from categorias"
            const result = await executeSql(sql)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar categorias", error)
        }
    }
}
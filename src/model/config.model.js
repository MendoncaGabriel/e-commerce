const executeSql = require('../utilities/executarSql')

module.exports = {
    dados: async () => {
        try {
            const sql = "SELECT * FROM shopdosbaloes.configuracoes;"
            const result = await executeSql(sql)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar configurações da empresa", error)
        }
    },
    banners: async () => {
        try {
            const sql = "SELECT * FROM shopdamaquiagem.banners;"
            const result = await executeSql(sql)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar banners da empresa", error)
        }
    }
}
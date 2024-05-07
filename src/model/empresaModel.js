const executeSql = require('../utilities/executarSql')

module.exports = {
    dados: async () => {
        try {
            const sql = "SELECT * FROM configuracoes;"
            const result = await executeSql(sql)
            console.log(result)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar configurações da empresa", error)
        }
    },
    bannerHome: async () => {
        try {
            const sql = `
            SELECT * FROM banners_home;`;
            const result = await executeSql(sql)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar banners da empresa", error)
        }
    },
    bannerAuth: async () => {
        try {
            const sql = `
            SELECT * FROM banners_auth;`;

            const result = await executeSql(sql)
            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar banners", error)
        }
    }
}
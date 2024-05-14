const executeSql = require('../utilities/executarSql');
const db = require('../../database/database');

module.exports = {
    dados: async () => {
        try {
            const sql = "SELECT * FROM configuracoes;"
            const result = await executeSql(sql)

            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar configurações da empresa", error)
        }
    },
    enderecos: async () => {
        try {
            const sql = "SELECT * FROM endereco_empresa;"
            const result = await executeSql(sql)
            console.log(result)

            return result
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar endereco da empresa", error)
        }
    },
    redesSociais: async () => {
        try {
            const sql = "SELECT * FROM redes_sociais;"
            const result = await executeSql(sql)

            return result[0]
        } catch (error) {
            console.log(error)
            throw new Error("Erro ao pegar redes_sociais da empresa", error)
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
    },
    metodosEntrega: async () => {
        return new Promise((resolve, reject) =>{
            const sql = "SELECT * FROM metodos_entrega"
            db.query(sql, [], (error, data) => {
                if(error){
                    reject(error)
                }else{
                    resolve(data)
                }
            })
        })
    }
}
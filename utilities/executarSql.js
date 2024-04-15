const db = require('../database/database')

function executeSql(sql, values){
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, data) => {
            if(error){
                let resumoErro = {
                    sqlState: error.sqlState || '?',
                    sqlMessage: error.message || ""
                } 
                console.log(resumoErro)
                reject(new Error("Erro ao executar SQL!", {error: resumoErro || error}))
            }else{
                resolve(data)
            }
        })
    })
}


module.exports = executeSql
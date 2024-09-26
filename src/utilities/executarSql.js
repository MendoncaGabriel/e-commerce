const db = require('../../database/database')

function executeSql(sql, values){
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, data) => {
            if(error){

                let msg = ''
                if (error.sqlState === '23000') {
                    msg = "Dados já foram cadastrados";
                } else if (error.sqlState === '42S02') {
                    msg = "Tabela não encontrada";
                } else if (error.sqlState === '42000') {
                    msg = "Erro de sintaxe SQL";
                } else {
                    msg = "Ocorreu um erro desconhecido";
                    console.log({
                        sqlState: error.sqlState,
                        sqlMessage: error.message
                    })
                }
                reject(msg)
            }else{
                resolve(data)
            }
        })
    })
}


module.exports = executeSql
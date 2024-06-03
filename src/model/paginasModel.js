const db = require('../../database/database')

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject)=>{
            const sql = "SELECT * FROM paginas;";
            db.query(sql, (error, result) => {
                if(error){
                    return reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    }
}
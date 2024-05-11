const db = require('../../database/database')

module.exports = {
    remover: (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM variantes WHERE variante_id = ?";
            const values = [id];
            db.query(sql, values, (error, data) => {
                if(error) {
                    reject(error)
                }else{
                    resolve(data)
                }
            })
        })
    }
}
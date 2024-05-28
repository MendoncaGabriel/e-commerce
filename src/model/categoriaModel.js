
const db = require('../../database/database')

module.exports = {
    create: (nome) =>{
        return new Promise((resolve, reject)=>{
            const sql = "INSERT INTO categorias (nome) VALUES (?);";
            const values = [nome]

            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            })

        })
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM categorias ORDER BY categoria_id DESC;"
            db.query(sql, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    },
    update: (id, nome) =>{
        return new Promise((resolve, reject)=>{
            const sql = "UPDATE categorias SET nome = ?  WHERE categoria_id = ?;";
            const values = [nome, id];

            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    },
    delete: (id) =>{
        return new Promise((resolve, reject)=>{
            const sql = "DELETE FROM categorias WHERE categoria_id = ?;";
            const values = [id];

            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    }
}
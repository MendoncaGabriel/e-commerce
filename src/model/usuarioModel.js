require('dotenv').config();
const db = require('../../database/database');

module.exports = {
    updateEndereco: async (rua, bairro, cep, cidade, estado, pais, numero_casa, referencia, telefone, idusuarios) => {
        return new Promise(async (resolve, reject) => {
         
            const sql = `
            UPDATE usuarios SET 
                rua = ?, 
                bairro = ?, 
                cep = ?, 
                cidade = ?, 
                estado = ?, 
                pais = ?, 
                numero_casa = ?, 
                referencia = ?,
                telefone = ? 
            WHERE idusuarios = ?;`;

           const values = [rua, bairro, cep, cidade, estado, pais, numero_casa, referencia, telefone, idusuarios];
           db.query(sql, values, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
           })
        })
        
    },
    getEndereco: async (idusuarios) => {

        const sql = `SELECT rua, bairro, cep, cidade, estado, pais, numero_casa, referencia, telefone FROM usuarios WHERE  idusuarios = ?`;
        const values = [idusuarios];
    
        return new Promise(async (resolve, reject) => {
            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result[0])
                }
            })
        });
    },
    usuarioExist: async (nome, email, telefone) => {
        return new Promise ((resolve, reject) => {
            const sql = "SELECT * FROM usuarios WHERE nome = ? OR email = ? OR telefone = ?"
            const values = [nome, email, telefone]
            
            db.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(result);
                }
            });
        })
    }
}

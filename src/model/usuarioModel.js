require('dotenv').config();
const db = require('../../database/database');

module.exports = {
    updateEndereco: async (data, idusuarios) => {
        return new Promise((resolve, reject) => {
            (async () => {
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
    
               const values = [data.rua, data.bairro, data.cep, data.cidade, data.estado, data.pais, data.numero_casa, data.referencia, data.telefone, idusuarios];
               db.query(sql, values, (error, result) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve(result)
                        
                    }
               })
            })()
        })
        
    },
    getEndereco: async (idusuarios) => {
        return new Promise((resolve, reject) => {
            (async () => {
                const sql = `SELECT rua, bairro, cep, cidade, estado, pais, numero_casa, referencia, telefone FROM usuarios WHERE  idusuarios = ?`;
                const values = [idusuarios];
                db.query(sql, values, (error, result) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve(result[0])
                    }
                })
            })()
        });
    },
    getById: async (id) => {

        return new Promise((resolve, reject) => {
            (async () => {
                const sql = `SELECT * FROM usuarios WHERE  idusuarios = ?`;
                const values = [id];
                db.query(sql, values, (error, result) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve(result[0])
                    }
                })
            })()
        });
    },
    usuarioExist: async (nome, email, telefone) => {
        return new Promise((resolve, reject) => {
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

require('dotenv').config();
const db = require('../../database/database');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.ASSINATURA_TOKEN;



function buscarUsuario(email){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM usuarios WHERE email = ?"
        const values = [email]
        db.query(sql, values, (error, data) => {
            if(error){
                reject(error)
            }else{
                resolve(data)
            }
        })
    })
};

module.exports = {
    login: async (email, senha) => {
        const usuario = await buscarUsuario(email);
        if(!usuario || usuario == []) throw new Error('Usuario não encontrado, verifique email');

        //verificar se senha esta correta
        const checkSenha = await bycript.compare(senha, usuario[0].senha)
        if(checkSenha == false) throw new Error('Senha incorreta!');

        //gerar token
        const payload = usuario[0];
        const validade = '30d';
        const token = jwt.sign(payload, secret, {expiresIn: validade});
        return token
    },
    signup: async (nome, email, senha, telefone) => {
       console.log('signup')
        //criptografar senha
        const salt = await bycript.genSalt(10);
        const senhaHash = await bycript.hash(senha, salt);

        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)"
            const values = [nome, email, senhaHash, telefone]
    
            db.query(sql, values, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    //gerar token
                    const payload = {nome, email, senhaHash, telefone, idusuario: result.insertId};
                    const validade = '30d';
                    const token = jwt.sign(payload, secret, {expiresIn: validade})
                    resolve(token);        
                }
            })
        })
    }
}
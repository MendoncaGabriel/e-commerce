require('dotenv').config();
const db = require('../../database/database');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.ASSINATURA_TOKEN;

function verificarExistenciaUsuario(nome, email, telefone){
    return new Promise ((resolve, reject) => {
        const sql = "SELECT * FROM usuarios WHERE nome = ? OR email = ? OR telefone = ?"
        const values = [nome, email, telefone]
        
        db.query(sql, values, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    })
}
function salvarUsuario(nome, email, senhaHash, telefone){
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)"
        const values = [nome, email, senhaHash, telefone]

        db.query(sql, values, (error, data) => {
            if(error){
                reject(error)
            }else{
                resolve(data)
            }
        })
    })
}
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
}

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
        const token = jwt.sign(payload, secret, {expiresIn: validade})
        return token
    },
    signup: async (nome, email, senha, telefone) => {
        //verificar se usuario ja existe
        const usuarioExiste = await verificarExistenciaUsuario(nome, email, telefone);

        // Verificar se há algum resultado
        let aviso = ''
        usuarioExiste[0]?.nome == nome ? aviso += "nome ja cadastrado" : '';
        usuarioExiste[0]?.email == email ? aviso += " email ja cadastrado,": '';
        usuarioExiste[0]?.telefone == telefone ? aviso += " telefone ja cadastrado," : '';
        if(usuarioExiste.length > 0) throw new Error(`Usuário já existe: ${aviso}`);

        //criptografar senha
        const salt = await bycript.genSalt(10);
        const senhaHash = await bycript.hash(senha, salt);

        //salvar usuario
        const usuario = await salvarUsuario(nome, email, senhaHash, telefone);
        if(usuario.affectedRows == 0) throw new Error('Erro inesperado, usuario não salvo!');
        return usuario;        
    }
}
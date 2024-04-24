const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

require('dotenv').config()
const executarSql = require('../utilities/executarSql')



class Utilitarios {
    static #chaveSecreta  = process.env.ASSINATURA_TOKEN 
    static async criptografarSenha(senha) {
        try {
          const salt = await bcrypt.genSalt(10);
          return await bcrypt.hash(senha, salt);
        } catch (error) {
          console.error('Erro ao criptografar senha:', error);
          throw error;
        }
    }

    static async verificarSenha(senha, hash) {
        try {
          return await bcrypt.compare(senha, hash);
        } catch (error) {
          console.error('Erro ao verificar senha:', error);
          throw error;
        }
    }

    static gerarToken(usuario) {
        try {
            return jwt.sign(usuario, this.#chaveSecreta, { expiresIn: '30d' });
        } catch (error) {
            console.error('Erro ao gerar token:', error);
            throw error;
        }
    }

    static verificarToken(token) {
        try {
            const decoded = jwt.verify(token, this.#chaveSecreta);
            return decoded;
        } catch (error) {
            console.error('Token inválido:', error.message);
            throw new Error('Token inválido');
        }
    }
}


class Usuario {
    constructor(nome, email, senha, telefone){
        this._nome = nome;
        this._email = email;
        this._senha = senha;
        this._telefone = telefone;
        this._token = null;
    }
    get nome(){
        return this._nome;
    };
    get email(){
        return this._email;
    };
    get telefone(){
        return this._telefone;
    };
    get senha(){
        return this._senha;
    };
    set senha(valor){
        this._senha = valor;
    };
    get token(){
        return this._token;
    };
    set token(valor){
        this._token = valor;
    };

}




module.exports = {
    novoUsuario: async (nome, email, senha, telefone) => {
        const usuario = new Usuario(nome, email, senha, telefone)
        usuario.senha = await Utilitarios.criptografarSenha(senha)
        usuario.token = await Utilitarios.gerarToken({nome, email, senha, telefone})


        const sql = 'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?);';
        const values = [usuario.nome, usuario.email, usuario.senha, usuario.telefone];

        return new Promise(async (resolve, reject) => {
            try {
                const result = await executarSql(sql, values);
                resolve({ msg: 'Usuário criado com sucesso!', id: result.insertId, token: usuario.token });
            } catch (error) {
                reject({ msg: 'Erro ao salvar usuário!', error });
            }
        });
    }
}
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
};

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
        const usuario = new Usuario(nome, email, senha, telefone);
        usuario.senha = await Utilitarios.criptografarSenha(senha);
    
        const sql = 'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?);';
        const values = [usuario.nome, usuario.email, usuario.senha, usuario.telefone];
    
        return new Promise(async (resolve, reject) => {
            try {
                const result = await executarSql(sql, values);
                const id = result.insertId;
    
                // Adiciona o ID ao token do usuário
                usuario.token = await Utilitarios.gerarToken({ id, nome, email, senha, telefone });
    
                resolve({ msg: 'Usuário criado com sucesso!', id, token: usuario.token });
            } catch (error) {
                reject({ msg: 'Erro ao salvar usuário!', error });
            }
        });
    },
    atualizarendereco: async (rua, numero, bairro, cidade, uf, pontoReferencia, tel1, tel2, tokenUsuario) => {
    
        const sql = `
        UPDATE usuarios 
        SET rua = ?, numero = ?, bairro = ?, cidade = ?, uf = ?, pontoReferencia = ?, tel1 = ?, tel2 = ?
        WHERE idusuarios = ?;
        `;

        const usuarioId = await Utilitarios.verificarToken(tokenUsuario).id
        const values = [rua, numero, bairro, cidade, uf, pontoReferencia, tel1, tel2, usuarioId];

        return new Promise (async (resolve, reject) => {
            try {
                const result = await executarSql(sql, values);
                console.log(result);
                resolve({ msg: 'Endereço do usuário atualizado!'});
            } catch (error) {
                reject({ msg: 'Erro ao atualizar endereço do usuario', error });
            };
        });
    },
    pegarEnderecoUsuario: async (tokenUsuario) => {
        const sql = `
        SELECT rua, numero, bairro, cidade, uf, pontoReferencia, tel1, tel2 
        FROM usuarios 
        WHERE idusuarios = ?;
        `;
    
        // Obtém o ID do usuário a partir do token
        const { id } = await Utilitarios.verificarToken(tokenUsuario);
    
        // Prepara os valores para a consulta SQL
        const values = [id];
    
        return new Promise(async (resolve, reject) => {
            try {
                // Executa a consulta SQL
                const result = await executarSql(sql, values);
                resolve(result[0]);
            } catch (error) {
                reject({ msg: 'Erro ao pegar endereço do usuário', error });
            }
        });
    },
    registarPedido: async (pedido, tokenUsuario) => {
        const { id } = await Utilitarios.verificarToken(tokenUsuario);
        const sql = "INSERT INTO pedidos (status, qtdProduto, usuarios_idusuarios, produtos_produto_id, variantes_variante_id, data) VALUES (?, ?, ?, ?, ?, ?);"
     
        try {
            await Promise.all(pedido.map(async element => {
                let data = new Date()
                const values = ['Aguardando Pagamento', element.qtdProduto, id, element.produto_id, element.variante_id, data ];
                const result = await executarSql(sql, values);
                console.log(result);
            }));
        } catch (error) {
            console.error("Erro ao registrar pedido:", error);
        }
    }
    
    

}
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
    novoUsuario: async (nome, email, senha) => {
        const usuario = new Usuario(nome, email, senha);
        usuario.senha = await Utilitarios.criptografarSenha(senha);
    
        const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?);';
        const values = [usuario.nome, usuario.email, usuario.senha];
    
        return new Promise(async (resolve, reject) => {
            try {
                const result = await executarSql(sql, values);
                const id = result.insertId;
    
                // Adiciona o ID ao token do usuário
                usuario.token = await Utilitarios.gerarToken({ id, nome, email, senha });
    
                resolve({ msg: 'Usuário criado com sucesso!', id, token: usuario.token });
            } catch (error) {
                reject({ msg: 'Erro ao salvar usuário!', error });
            }
        });
    },
    atualizarendereco: async (rua, numero, bairro, cidade, estado, referencia, telefone, tokenUsuario) => {
        console.log('===> Model ', { rua, numero, bairro, cidade, estado, referencia, telefone, tokenUsuario})
      
        let enderecoAtual = {}
        let atualizar = false;
        try {
            console.log('Endereço do usuario encontrado!')
            enderecoAtual = await module.exports.pegarEnderecoUsuario(tokenUsuario);
            atualizar = true;
            
        } catch (error) {
            console.log('Endereço não encontrado, inserindo novo...')
            enderecoAtual = await module.exports.inserirEnderecoUsuario(rua, numero, bairro, cidade, estado, referencia, telefone, tokenUsuario);
            return {msg: 'Endereço não encontrado, novo endereço inserido!'}
        }

    
        if(atualizar == true){
            console.log('Atualizando endereço...')
            const sql = `
            
            UPDATE endereco_cliente 
            JOIN usuarios ON usuarios.idusuarios = endereco_cliente.usuarios_idusuarios 
            SET 
                endereco_cliente.rua = ?, 
                endereco_cliente.numero = ?, 
                endereco_cliente.bairro = ?, 
                endereco_cliente.cidade = ?, 
                endereco_cliente.estado = ?, 
                endereco_cliente.referencia = ? 
                endereco_cliente.telefone = ? 
            WHERE usuarios.idusuarios = ?;
            `;
            const usuarioId = await Utilitarios.verificarToken(tokenUsuario).id
            console.log('===> update endereço: ', {rua, numero, bairro, cidade, estado, referencia, telefone, usuarioId})
            const values = [rua, numero, bairro, cidade, estado, referencia, telefone, usuarioId];

            try {
                const result = await executarSql(sql, values);
                if(!result || typeof result == "undefined") throw new Error('Erro ao atualizar endereço do usuario - ' + result);
                return { msg: 'Endereço do usuário atualizado!'}
            } catch (error) {
        
                return { msg: 'Erro ao atualizar endereço do usuario', error }
            }
        }




            
        
    },
    inserirEnderecoUsuario: async (rua, numero, bairro, cidade, estado, referencia, telefone, tokenUsuario) => {
        try {
            console.log(tokenUsuario)
            // Obtém o ID do usuário a partir do token
            const usuarioId = await Utilitarios.verificarToken(tokenUsuario).id
            console.log(usuarioId)

    
            // Prepara a consulta SQL para inserir o novo endereço
            const sql = `
                INSERT INTO endereco_cliente (rua, numero, bairro, cidade, estado, referencia, telefone, usuarios_idusuarios)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const values = [rua, numero, bairro, cidade, estado, referencia, telefone, usuarioId];
    
            // Executa a consulta SQL para inserir o novo endereço
            const result = await executarSql(sql, values);
            
            // Verifica se o endereço foi inserido com sucesso
            if (!result || typeof result.insertId === 'undefined') {
                throw new Error('Erro ao inserir o endereço do usuário');
            }
    
            return { msg: 'Novo endereço do usuário inserido com sucesso!' };
        } catch (error) {
            return { msg: 'Erro ao inserir endereço do usuário', error };
        }
    },
    

    pegarEnderecoUsuario: async (tokenUsuario) => {
        const sql = `
        SELECT 
            endereco_cliente.rua, 
            endereco_cliente.numero, 
            endereco_cliente.bairro, 
            endereco_cliente.cidade, 
            endereco_cliente.estado, 
            endereco_cliente.referencia, 
            endereco_cliente.telefone
        FROM usuarios 
        JOIN endereco_cliente ON usuarios.idusuarios = endereco_cliente.usuarios_idusuarios 
        WHERE usuarios.idusuarios = ?;`;
    
    
        // Obtém o ID do usuário a partir do token
        const { id } = await Utilitarios.verificarToken(tokenUsuario);
    
        // Prepara os valores para a consulta SQL
        const values = [id];
    
        return new Promise(async (resolve, reject) => {
            try {
                // Executa a consulta SQL
                const result = await executarSql(sql, values);
                if(!result || result.length == 0) throw new Error('Endereço do usuario não definido ou não encontrado')
                console.log(result)
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
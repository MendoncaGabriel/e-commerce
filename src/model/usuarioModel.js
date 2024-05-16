require('dotenv').config();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const db = require('../../database/database');


module.exports = {
    updateEndereco: async (rua, numero, bairro, cidade, estado, referencia, telefone, tokenUsuario) => {
        return new Promise(async (resolve, reject) => {
            //inserir


            //se der erro atuali
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

            let enderecoAtual = {};
            let atualizar = false;
            try {
                enderecoAtual = await module.exports.pegarEnderecoUsuario(tokenUsuario);
                atualizar = true;
                
            } catch (error) {
                console.log('===> Inserindo novo endereço')
                enderecoAtual = await module.exports.inserirEnderecoUsuario(rua, numero, bairro, cidade, estado, referencia, telefone, tokenUsuario);
               
                return {msg: 'Endereço não encontrado, novo endereço inserido!'};
            }
        })
        
        
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
                endereco_cliente.referencia = ?,
                endereco_cliente.telefone = ? 
            WHERE usuarios.idusuarios = ?;`;

            const usuarioId = await Utilitarios.verificarToken(tokenUsuario).id
            const values = [rua, numero, bairro, cidade, estado, referencia, telefone, usuarioId];

            try {
                const result = await executarSql(sql, values);
                if(!result || typeof result == "undefined") throw new Error('Erro ao atualizar endereço do usuario - ' + result);
                return { msg: 'Endereço do usuário atualizado!'}
            } catch (error) {
                console.log(error)
                return { msg: 'Erro ao atualizar endereço do usuario', error }
            }
        }
    },
    getEndereco: async (tokenUsuario) => {
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
        const { idusuarios } = await Utilitarios.verificarToken(tokenUsuario);

        // Prepara os valores para a consulta SQL
        const values = [idusuarios];
    
        return new Promise(async (resolve, reject) => {
            try {
                // Executa a consulta SQL
                const result = await executarSql(sql, values);
                if(!result || result.length == 0) console.log('Endereço do usuario não definido ou não encontrado')
                resolve(result[0] || []);
            } catch (error) {
                reject({ msg: 'Erro ao pegar endereço do usuário', error });
            }
        });
    }

}
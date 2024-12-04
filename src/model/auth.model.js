const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../../database/schemas/usuario.schema');

async function buscarUsuario(email) {
    try {
        return await Usuario.findOne({ where: { email: email } });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};

async function checkPassword(password, user) {
    try {
        if (!user || !(await bcrypt.compare(password, user.senha))) {
            throw new Error('Senha incorreta!');
        }
    } catch (error) {
        console.error('Erro ao verificar senha:', error);
        throw error;
    }
};

async function createHash(usuario) {
    try {
        const payload = { id: usuario.id, email: usuario.email }; // Exemplo de payload do JWT
        const hash = jwt.sign(payload, process.env.ASSINATURA_TOKEN, { expiresIn: '30d' });
        return hash;
    } catch (error) {
        console.error('Erro ao criar token:', error);
        throw error;
    }
};

async function encryptPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error('Erro ao criptografar senha:', error);
        throw error;
    }
};


exports.login = async (email, senha) => {
    try {
        const user = await buscarUsuario(email);
        if (!user) {
            throw new Error('Usuário não encontrado!');
        }

        await checkPassword(senha, user);
        return await createHash(user);
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

exports.signup = async (nome, email, senha, telefone) => {
    try {
        const hash = await encryptPassword(senha);
        return await Usuario.create({
            nome: nome,
            email: email,
            senha: hash,
            telefone: telefone
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        throw error;
    }
};
// compactarImagem.js

const sharp = require('sharp');

// Middleware para compactar imagens usando sharp
const compactarImagem = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(); // Se não houver arquivo, passa para o próximo middleware
        }

        // Compacta a imagem usando sharp
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 800 }) // Ajuste o tamanho conforme necessário
            .toBuffer();

        req.file.buffer = buffer; // Substitui o buffer original pelo buffer compactado

        next(); // Passa para o próximo middleware
    } catch (error) {
        console.error('Erro ao compactar imagem:', error);
        next(error); // Passa o erro para o próximo middleware de erro
    }
};

module.exports = compactarImagem;

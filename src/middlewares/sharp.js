const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


async function compactar(caminhoDaImagem) {
    try {
        // Verifica se o arquivo existe
        if (!fs.existsSync(caminhoDaImagem)) {
            throw new Error('O arquivo não existe');
        }

        // Caminho para a pasta de imagens compactadas (substituídas)
        const pastaCompactada = path.dirname(caminhoDaImagem);
        const nomeArquivo = path.basename(caminhoDaImagem);
        const caminhoImagemCompactada = path.resolve(pastaCompactada, 'compressed', nomeArquivo);

        // Compacta a imagem
        await sharp(caminhoDaImagem)
            .resize(500) // Define o tamanho desejado
            .toFile(caminhoImagemCompactada);

        // Move a imagem compactada para substituir a original
        fs.renameSync(caminhoImagemCompactada, caminhoDaImagem);

        console.log('Imagem compactada com sucesso:', caminhoDaImagem);
    } catch (error) {
        console.error('Erro ao compactar a imagem:', error.message);
    }
}


const compactarImagem = function (req, res, next) {
    console.log('===> req.file.filename: ',req.imagens)
    if (!req.imagens) {
        return next(new Error('Nenhuma imagem foi enviada'));
    }

    req.imagens.forEach(async imagem => {        
        compactar(path.resolve('src', 'public', 'img', imagem))
        .then(() => next())
        .catch(err => next(err));
    });
};


module.exports = compactarImagem
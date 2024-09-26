const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compactar(caminhoDaImagem) {
    try {
        if (!fs.existsSync(caminhoDaImagem)) {
            throw new Error('O arquivo não existe');
        }

        // Define o caminho para a imagem compactada
        const caminhoImagemCompactada = caminhoDaImagem.replace('.png', '-compressed.png');

        // Compacta a imagem e salva com um nome diferente
        await sharp(caminhoDaImagem)
            .resize(500)
            .jpeg({ quality: 80 }) // Define a qualidade para formatos JPEG (opcional)
            .png({ compressionLevel: 8 }) // Define a compressão para formatos PNG (opcional)
            .toColorspace('srgb') // Reduz o número de cores (opcional)
            .toFile(caminhoImagemCompactada);

        // Renomeia a imagem compactada para substituir a original
        fs.renameSync(caminhoImagemCompactada, caminhoDaImagem);

        console.log('Imagem compactada com sucesso:', caminhoDaImagem);
    } catch (error) {
        console.error('Erro ao compactar a imagem:', error.message);
    }
}



const compactarImagem = function (req, res, next) {
    console.log('===> req.file.filename: ',req.imagens)


    console.log(req.body)
    if (!req.imagens) {
        console.log('Nenhuma imagem foi enviada');
        return next();
    }

    req.imagens.forEach(async imagem => {        
        compactar(path.resolve('src', 'public', 'img', imagem))
        .then(() => next())
        .catch(err => next(err));
    });
};


module.exports = compactarImagem
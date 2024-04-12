const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');

const compressImages = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            // Pasta de destino para imagens compactadas
            const destinationFolder = path.resolve('public', 'compressed_images');

            // Crie a pasta de destino se não existir
            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder);
            }

            // Compacte cada imagem enviada
            await Promise.all(req.files.map(async (file) => {
                const outputFilePath = path.join(destinationFolder, file.filename);
                await imagemin([file.path], {
                    destination: destinationFolder,
                    plugins: [
                        imageminMozjpeg({ quality: 80 }), // Compressão JPEG
                        imageminPngquant({ quality: [0.6, 0.8] }) // Compressão PNG
                    ]
                });
            }));

            // Remova os arquivos originais
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        next();
    } catch (error) {
        console.error('Erro ao compactar imagens:', error);
        next(error);
    }
};

module.exports = compressImages;

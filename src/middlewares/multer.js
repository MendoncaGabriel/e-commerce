// multer.js

const multer = require('multer');
const path = require('path');

// Configuração do destino e nome do arquivo para o multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('src', 'public', 'img'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('O arquivo não é uma imagem.'));
        }
    }
});

module.exports = upload;

const multer = require('multer');
const path = require('path');

// Configuração do multer para salvar os arquivos na pasta desejada
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('src', 'public', 'img')); 
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        // const nomeArquivo = file.fieldname + '-' + Date.now() + extensao;
        const nomeArquivo = file.originalname; //não alterar nome do aquivo
        console.log('===> nome do aquivo: ', nomeArquivo)
        req.imagens = req.imagens || [];
        req.imagens.push(nomeArquivo);
        cb(null, nomeArquivo);
    }
});

// Configuração do multer para aceitar apenas arquivos de imagem
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.gif']; // Extensões permitidas
        const extensao = path.extname(file.originalname).toLowerCase();
        if (extensoesPermitidas.includes(extensao)) {
            cb(null, true);
        } else {
            cb(new Error('Somente imagens são permitidas'));
        }
    }
});

module.exports = upload;

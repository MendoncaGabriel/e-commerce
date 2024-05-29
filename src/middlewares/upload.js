const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('O arquivo não é uma imagem.'));
        }
    }
}).single('imagem');


const manipularImagem = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        if (!req.file) {
            return next();
        }

        try {
            const buffer = await sharp(req.file.buffer)
            .resize({ width: 800 }) 
            .jpeg({ quality: 80 })
            .toBuffer();

            //const fileName = `${Date.now()}-${req.file.originalname}`;
            const fileName = `${Date.now()}`;
            const filePath = path.resolve('src', 'public', 'img', fileName);

            fs.writeFileSync(filePath, buffer);

            req.file.path = filePath;
            req.file.filename = fileName;

            next(); 
        } catch (error) {
            console.error('Erro ao manipular a imagem:', error);
            res.status(500).json({ msg: 'Erro interno no servidor' });
        }
    });
};

module.exports = manipularImagem;

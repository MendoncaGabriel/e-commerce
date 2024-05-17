const cors = require('cors')
const path = require('path');
const logger = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');

const authRouter = require('./src/routes/api/authRouter');
const lojaRouter = require('./src/routes/pages/lojaRouter');
const adminRouter = require('./src/routes/pages/adminRouter');
const usuarioRouter = require('./src/routes/api/usuarioRouter');
const produtoRouter = require('./src/routes/api/produtoRouter');
const varianteRouter = require('./src/routes/api/varianteRouter');
const pagamentoRouter = require('./src/routes/api/pagamentoRouter');


// arquivos estativos
var app = express();
app.use('/js', express.static(path.join(__dirname, 'src/public/js')));
app.use('/css', express.static(path.join(__dirname, 'src/public/css')));
app.use('/img', express.static(path.join(__dirname, 'src/public/img')));
app.use('/icons', express.static(path.join(__dirname, 'src/public/icons')));
app.use('/assets', express.static(path.join(__dirname, 'src/public/assets')));
app.use('/banner', express.static(path.join(__dirname, 'src/public/banner')));

// arquivos de visualização
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/variante', varianteRouter);
app.use('/pagamento', pagamentoRouter);
app.use('/produto', produtoRouter);
app.use('/usuario', usuarioRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/', lojaRouter);

app.use((req, res, next) => {
    res.status(404).render('404'); 
});

module.exports = app;
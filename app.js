const cors = require('cors')
const path = require('path');
const logger = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit')

const categoriaRouter = require('./src/routes/api/categoriaRouter');
const pesquisaRouter = require('./src/routes/api/pesquisaRouter');
const authRouter = require('./src/routes/api/authRouter');
const lojaRouter = require('./src/routes/pages/lojaRouter');
const adminRouter = require('./src/routes/pages/adminRouter');
const usuarioRouter = require('./src/routes/api/usuarioRouter');
const produtoRouter = require('./src/routes/api/produtoRouter');
const varianteRouter = require('./src/routes/api/varianteRouter');
const pagamentoRouter = require('./src/routes/api/pagamentoRouter');

var app = express();


// middlewares
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hora
	limit: 500, // Limitar cada IP a 300 requisições por `window` (aqui, por 1 hora).
	standardHeaders: 'draft-7', // draft-6: cabeçalhos `RateLimit-*`; draft-7: cabeçalho combinado `RateLimit`
	legacyHeaders: false, // Desabilitar os cabeçalhos `X-RateLimit-*`.
})
//  app.use(limiter)



// arquivos estativos
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

// API
app.use('/categoria', categoriaRouter);
app.use('/pesquisa', pesquisaRouter);
app.use('/variante', varianteRouter);
app.use('/pagamento', pagamentoRouter);
app.use('/produto', produtoRouter);
app.use('/usuario', usuarioRouter);
app.use('/auth', authRouter);

// Paginas
app.use('/admin', adminRouter);
app.use('/', lojaRouter);



module.exports = app;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const authRouter = require('./src/routes/authRouter');
const lojaRouter = require('./src/routes/pages/lojaRouter');
const pedidoRouter = require('./src/routes/pedidoRouter');
const usuarioRouter = require('./src/routes/usuarioRouter')
const pagamentoRouter = require('./src/routes/pagamentoRouter')
var app = express();

// arquivos estativos
app.use('/banner', express.static(path.join(__dirname, 'src/public/banner')));
app.use('/css', express.static(path.join(__dirname, 'src/public/css')));
app.use('/js', express.static(path.join(__dirname, 'src/public/js')));
app.use('/icons', express.static(path.join(__dirname, 'src/public/icons')));
app.use('/img', express.static(path.join(__dirname, 'src/public/img')));
app.use('/assets', express.static(path.join(__dirname, 'src/public/assets')));

// arquivos de visualização
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');


app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//app.use(sqlstring) //proteção contra sql injection
// app.use('/admin', pageRouterAdmin);
app.use('/pagamento', pagamentoRouter);
app.use('/usuario', usuarioRouter);
app.use('/pedido', pedidoRouter);
app.use('/auth', authRouter);
app.use('/', lojaRouter);


module.exports = app;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session');

// const apiRouter = require('./src/routes/api/api.router');
// const pagesRouterLoja = require('./src/routes/loja/loja.page.router')
// const pageRouterAdmin = require('./src/routes/admin/admin.pages.router')
const authRouter = require('./src/routes/authRouter');
const lojaRouter = require('./src/routes/pages/lojaRouter');
const pedidoRouter = require('./src/routes/pedidoRouter');
var app = express();

// Express Session 
// app.use(session({
//     secret: process.env.ASSINATURA_TOKEN, 
//     resave: false,
//     saveUninitialized: true
// }));

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
// app.use('/api', apiRouter);
app.use('/pedido', pedidoRouter);
app.use('/auth', authRouter);
app.use('/', lojaRouter);


module.exports = app;
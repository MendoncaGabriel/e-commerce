const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const apiRouter = require('./src/routes/api/api.router');
const pagesRouterLoja = require('./src/routes/loja/loja.page.router')
const pageRouterAdmin = require('./src/routes/admin/admin.pages.router')

var app = express();
app.use(cors())
// arquivos estativos
app.use('/css', express.static(path.join(__dirname, 'src/public/css')));
app.use('/js', express.static(path.join(__dirname, 'src/public/js')));
app.use('/icons', express.static(path.join(__dirname, 'src/public/icons')));
app.use('/img', express.static(path.join(__dirname, 'src/public/img')));
app.use('/assets', express.static(path.join(__dirname, 'src/public/assets')));

// arquivos de visualização
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(sqlstring) //proteção contra sql injection
app.use('/admin', pageRouterAdmin);
app.use('/api', apiRouter);
app.use('/', pagesRouterLoja);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {err, msg: res.locals.message, error:res.locals.error });
});

module.exports = app;
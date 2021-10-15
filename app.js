const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
var cookieParser = require('cookie-parser');
const HOST = '0.0.0.0';
const PORT = 8081;

//라우터를 연결
const { sequelize } = require('./models');
const indexRouter = require('./api/auth');
const usersRouter = require('./api/user/users');
const commentsRouter = require('./api/user/comments');
const testRouter = require('./api/auth/test');
const app = express();

// view engine setup
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/api', require('./api/auth'));
app.use('/test', testRouter);
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
module.exports = app;

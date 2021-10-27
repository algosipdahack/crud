const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
require("dotenv").config();
var cookieParser = require('cookie-parser');
const PORT = process.env.NODE_DOCKER_PORT || 8080;

const { isLoggedIn, isNotLoggedIn } = require('./routes/middlewares');
//라우터를 연결
const { sequelize } = require('./models');

const { swaggerUi, specs } = require('./modules/swagger');
const app = express();
passportConfig();

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
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const user = require('./api/user/users');
const comment = require('./api/user/comments');
const auth = require('./api/auth/index');
const indexRouter = require('./page/auth');

app.use('/', indexRouter);

/* api routing */
app
  /* 유저 API */
  .get('/users', user.readAll)
  .post('/users', isNotLoggedIn, user.register)
  .get('/users/:id', user.read)
  .patch('/users/:id', isLoggedIn, user.update)
  .delete('/users/:id', isLoggedIn, user.remove)
  .get('/users/logout', isLoggedIn, user.logout)
  .get('/users/:id/comments', user.commentRead)
  .post('/comments', comment.create)
  .patch('/comments/:id', isLoggedIn, comment.patch)
  .delete('/comments/:id', isLoggedIn, comment.remove)
  .post('/auth/token', isNotLoggedIn, auth.create)

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

//error handling
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;

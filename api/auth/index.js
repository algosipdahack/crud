var express = require('express');
const User = require('../../models/user');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const { verifyToken, isLoggedIn, isNotLoggedIn } = require('../../routes/middlewares');
const SECRET = config.secret_key;

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', isNotLoggedIn, async (req, res, next) => {//get방식 라우터
  const users = await User.findAll().catch((err) => {
    console.error(err);
    next(err);
  });
  res.render('sequelize', { users });
});


router.post('/refresh', isLoggedIn, async (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.log(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return user;
  })(req, res, next);
});

router.get('/verify', isLoggedIn, async (req, res, next) => {//login.html로 라우팅
  const loginId = req.query.loginId;
  const users = await User.findAll().catch((err) => {
    console.error(err);
    next(err);
  });
  res.render('verify', { users: users, loginId: loginId });
});


router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
});

router.delete('/delete/:id', isLoggedIn, (req, res) => {
  const id = req.params.id;
  const result = User.destroy({
    where: { loginId: id },
  }).catch((e) => {
    res.status(500).json({ status: false, result: "delete error" });
  });
  return res.status(201).json({ result: result });
});

router.post('/register', isNotLoggedIn, async (req, res, next) => {
  const { loginId, pw, name, age, married } = req.body;

  const result = await User.count({
    where: {
      loginId: loginId
    }
  }).catch((e) => {
    return res.redirect('/join?error=exist');
  });

  if (result === 1) {
    res.status(304).json({ status: false, result: "userid already exist" })
  }
  else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.status(500).json({ status: false, result: "Bcrypt genSalt error" });
      }
      else {
        bcrypt.hash(pw, salt, null, (err, hash) => {
          if (err) {
            res.status(500).json({ status: false, result: "Bcrpyt hashing error" });
          }
          else {
            User.create({
              loginId,
              pw: bcrypt.hashSync(pw),
              name,
              age,
              married
            }).catch((e) => {
              console.error(e);
              return next(e);
            });
            res.status(201).json({ status: true, result: "register success" });
          }
        });
      }
    })
  }
});
module.exports = router;

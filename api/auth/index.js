var express = require('express');
const User = require('../../models/user');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const { verifyToken } = require('../../routes/middlewares');
const SECRET = config.secret_key;


router.get('/', async (req, res, next) => {//get방식 라우터
  const users = await User.findAll().catch((err) => {
    console.error(err);
    next(err);
  });
  res.render('sequelize', { users });
});

router.route('/login/:id')
  .get(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findOne({
      where: {
        loginId: id,
      },
    }).catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, result: 'No user' });
    });
    res.json(user);
  });

router.get('/login', async (req, res, next) => {//get방식 라우터
  const users = await User.findAll().catch((err) => {
    console.error(err);
    next(err);
  });
  res.render('login', { users });
});

router.get('/test', verifyToken, async (req, res) => {
  const loginId = req.query.loginId;
  console.log('test', loginId);
  console.log(req);
  const users = await User.findAll().catch((err) => {
    console.error(err);
    next(err);
  });
  if (req.decoded == null) {
    res.render('login', { users: users });
  }
  res.render('verify', { users: users, loginId: loginId });
});

router.get('/refresh', verifyToken, async (req, res) => {
  console.log(req.query.loginId);
  console.log(req.decoded.loginId);
  if (req.decoded == null) {
    res.render('login', { users: users });
  }
  else res.json(req.decoded);
})

router.post('/token', async (req, res, next) => {
  const loginId = req.body.loginId;
  const pw = req.body.pw;

  const user = await User.findOne({
    where: {
      loginId: loginId,
    },
  }).catch((e) => {
    console.log(e);
    res.status(500).json({ status: false, result: 'login error' });
  });
  if (user != null) { //유저가 존재한다면
    bcrypt.compare(pw, user.pw, (err, result) => {
      if (result === true) {//로그인 성공
        const token = jwt.sign({//토큰 발급
          loginId: loginId
        }, SECRET, {
          algorithm: 'HS256',
          expiresIn: '10m'
        })
        //쿠키로 저장
        res.cookie('user', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ status: true, token: token });
      } else if (err) {
        res.status(500).json({ status: false, result: "Bcrypt error" });
      } else {
        res.status(401).json({ status: false, result: "incorrect password" });
      }
    })
  } else {
    res.status(404).json({ status: false, result: "user does not exist" });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/');
});

router.post('/register', async (req, res, next) => {
  const loginId = req.body.loginId;
  const pw = req.body.pw;
  const name = req.body.name;
  const age = req.body.age;
  const married = req.body.married;

  const result = await User.count({
    where: {
      loginId: loginId
    }
  }).catch((e) => {
    res.status(500).json({ status: false, result: "register error" });
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
            console.log(hash);
            const user = User.create({
              loginId: loginId,
              pw: bcrypt.hashSync(pw),
              name: name,
              age: age,
              married: married
            })
            console.log(user);
            res.status(201).json({ status: true, result: "register success" });
          }
        });
      }
    })
  }
});
module.exports = router;
